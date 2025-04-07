import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

// services
import { StripeService } from '../../stripe/stripe.service';
import { PaymentsService } from '../../../payments.service';

// dto, entities and interfaces
import { VisaPaymentDataDto } from '../../enroll-courses/dto/payment.data.dto';
import { Plan } from '../../../../plans/entity/plan.entity';
import { PaymentsHistory } from '../../../entities/payments.history.entity';
import { PlanPaymentMetadataI } from '../../../interfaces/payment.metadata.interface';
import { AccountSubscriptions } from '../entity/account.plan.entity';

@Injectable()
export class CreateSubscribe {
    private readonly logger: Logger = new Logger(CreateSubscribe.name);

    constructor(
        @Inject()
        private readonly stripeService: StripeService,
        @Inject()
        private readonly paymentsService: PaymentsService,
        @Inject()
        private readonly dataSource: DataSource,
    ) {}

    /**
     * Process the creation of a subscription for a given plan and account.
     * @param plan_id
     * @param account_id
     * @param visaPaymentDataDto
     */
    async processCreateSubscription(
        plan_id: number,
        account_id: number,
        visaPaymentDataDto: VisaPaymentDataDto,
    ) {
        this.logger.log('Processing payment');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let latest_charge: string | null = null;

        try {
            // Logic to find the plan
            const plan = await this.findPlan(plan_id, queryRunner);
            if (!plan)
                throw new NotFoundException({
                    message: 'Plan not found',
                    details: `Plan with ID ${plan_id} not found`,
                });

            // Logic to create a subscription
            await this.createSubscription(plan, account_id, queryRunner);

            // Logic to create a subscription
            const subscription = await this.processPayment(plan, account_id, visaPaymentDataDto);
            latest_charge = subscription.latest_charge as string;

            // Logic to save subscription history

            await this.saveSubscriptionHistory(
                {
                    amount: plan.plan_price,
                    country: visaPaymentDataDto.country,
                    payment_method: visaPaymentDataDto.payment_method,
                    currency: 'usd',
                    status: 'success',
                    payment_intent_id: subscription.id,
                    latest_charge_id: latest_charge,
                    payment_method_id: visaPaymentDataDto.paymentMethodId,
                    account: { id: account_id },
                },
                queryRunner,
            );

            this.logger.log('Payment history created');
            // Commit the transaction
            await queryRunner.commitTransaction();

            this.logger.log('Payment finished successfully');
        } catch (error) {
            this.logger.log('Payment process failed', error);
            await queryRunner.rollbackTransaction();

            if (latest_charge) {
                await this.stripeService.refundPayment(latest_charge);
                this.logger.log('Payment refunded');
            }

            await this.paymentsService.createPaymentHistory(
                {
                    amount: 0,
                    country: visaPaymentDataDto.country,
                    currency: 'usd',
                    status: 'failed',
                    failed_reason: error.message,
                    payment_method: visaPaymentDataDto.payment_method,
                },
                account_id,
            );
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private async findPlan(plan_id: number, queryRunner: QueryRunner): Promise<Plan> {
        // Logic to find the plan in the database
        return queryRunner.manager.findOne(Plan, { where: { id: plan_id } });
    }

    private async createSubscription(
        plan: Plan,
        account_id: number,
        queryRunner: QueryRunner,
    ): Promise<void> {
        try {
            await queryRunner.manager.insert(AccountSubscriptions, {
                start_at: new Date(),
                end_at: new Date(Date.now() + plan.plan_duration * 24 * 60 * 60 * 1000), // // add days in ms
                plan: { id: plan.id },
                account: { id: account_id },
            });
        } catch (error) {}
    }

    /**
     *
     * @param plan
     * @param account_id
     * @param visaPaymentDataDto
     * @private
     */
    private async processPayment(
        plan: Plan,
        account_id: number,
        visaPaymentDataDto: VisaPaymentDataDto,
    ) {
        const metadata: PlanPaymentMetadataI = {
            account_id: account_id.toString(),
            plan_id: plan.id.toString(),

            purchase_type: 'course enrollment',
            purchase_platform: 'web',
            enrollment_date: new Date().toISOString(),

            country: visaPaymentDataDto.country,
            price_paid: plan.plan_price.toString(),
            payment_method_type: 'visa',
        };

        return await this.stripeService.processPayment(
            plan.plan_price,
            visaPaymentDataDto.paymentMethodId,
            metadata,
        );
    }

    /**
     * Save the subscription history in the database.
     * @param data
     * @param queryRunner
     */
    private async saveSubscriptionHistory(data: any, queryRunner: QueryRunner) {
        try {
            await queryRunner.manager.insert(PaymentsHistory, {
                ...data,
            });
        } catch (error) {
            this.logger.error('Error saving subscription history', error);
            throw new NotFoundException({
                message: 'Process payment failed',
                details: 'Error saving subscription history',
            });
        }
    }
}
