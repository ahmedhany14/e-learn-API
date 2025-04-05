import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

// repository
import { EntollCoursesRepo } from '../repository/entoll-courses.repo';

// services
import { StripeService } from 'src/payments/modules/stripe/stripe.service';
import { PaymentsService } from 'src/payments/payments.service';

// dto, entities, and enums
import { VisaPaymentDataDto } from '../dto/payment.data.dto';
import { CourseStatusEnum } from 'src/courses/enums/course.status.enum';
import { DataSource } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { EnrolledCourses } from '../entity/enrolled.courses.entity';
import { PaymentsHistory } from 'src/payments/entities/payments.history.entity';
import * as console from 'node:console';

// enums and dtos

@Injectable()
export class EnrollCoursesService {
    private readonly logger = new Logger(EnrollCoursesService.name);

    constructor(
        @Inject()
        private readonly stripeService: StripeService,
        @Inject()
        private readonly paymentsService: PaymentsService,
        @Inject()
        private readonly dataSource: DataSource,
    ) {}

    async enrollCoursesByVisa(
        course_id: number,
        visaPaymentDataDto: VisaPaymentDataDto,
        account_id: number,
    ) {
        this.logger.log('Processing payment');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let latest_charge: string | null = null;
        try {
            const course = await queryRunner.manager.findOne(Course, {
                where: { id: course_id },
            });

            if (!course || course.state !== CourseStatusEnum.PUBLISHED) {
                throw new NotFoundException({
                    message: 'Process payment failed, course not found or not published',
                    details: 'Course not found or not published',
                });
            }
            // insert into enrolled courses the course and account
            await queryRunner.manager.insert(EnrolledCourses, {
                account: { id: account_id },
                course: { id: course_id },
            });

            this.logger.log('Course found, processing payment');
            // process payment in stripe
            const paymentIntent = await this.stripeService.processPayment(
                course.price,
                visaPaymentDataDto.paymentMethodId,
                {
                    account_id: account_id.toString(),
                    course_id: course_id.toString(),

                    purchase_type: 'course enrollment',
                    purchase_platform: 'web',
                    enrollment_date: new Date().toISOString(),

                    country: visaPaymentDataDto.country,
                    price_paid: course.price.toString(),
                    payment_method_type: 'visa',
                },
            );
            latest_charge = paymentIntent.latest_charge as string;

            if (paymentIntent.status !== 'succeeded') {
                this.logger.log('Payment not succeeded');
                throw new BadRequestException({
                    message: 'Process payment failed',
                    details: 'Payment not succeeded',
                });
            }
            this.logger.log('Payment history created');
            // insert into payment history the payment details
            await queryRunner.manager.insert(PaymentsHistory, {
                amount: course.price,
                country: visaPaymentDataDto.country,
                payment_method: visaPaymentDataDto.payment_method,
                currency: 'usd',
                status: 'success',
                payment_intent_id: paymentIntent.id,
                latest_charge_id: latest_charge,
                payment_method_id: visaPaymentDataDto.paymentMethodId,
                account: { id: account_id },
            });

            await queryRunner.commitTransaction();

            this.logger.log('Payment process completed');
        } catch (e) {
            this.logger.log('Payment process failed');
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
                    failed_reason: e.message,
                    payment_method: visaPaymentDataDto.payment_method,
                },
                account_id,
            );

            throw new BadRequestException({
                message: 'Process payment failed',
                details: e.message,
            });
        } finally {
            await queryRunner.release();
            this.logger.log('Payment process completed');
        }
    }
}
