import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

// services
import { StripeService } from 'src/payments/modules/stripe/stripe.service';
import { PaymentsService } from 'src/payments/payments.service';
import { AbstractRepoService } from '@app/abstract.db';

// dto, entities, and enums
import { VisaPaymentDataDto } from '../dto/payment.data.dto';
import { CourseStatusEnum } from 'src/courses/enums/course.status.enum';
import { DataSource, QueryRunner, Repository, EntityManager } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { EnrolledCourses } from '../entity/enrolled.courses.entity';
import { PaymentsHistory } from 'src/payments/entities/payments.history.entity';
import { PaymentMetadataI } from '../../../interfaces/payment.metadata.interface';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Service for enrolling courses and processing payments,
 * This service handles the enrollment of courses by processing payments through Stripe.
 * It includes methods for enrolling a course, processing payments, and managing payment history.
 * The payment process steps include:
    1. Check if the course is published and find course
    2. Insert into enrolled courses the course and account
    3. Process payment in Stripe
    4. Insert into payment history the payment details
    5. Handle payment failures and roll-back transactions
 */
@Injectable()
export class EnrollCoursesService extends AbstractRepoService<EnrolledCourses> {
    protected readonly logger = new Logger(EnrollCoursesService.name);

    constructor(
        @InjectRepository(EnrolledCourses)
        private readonly enrolledCoursesRepo: Repository<EnrolledCourses>,
        @Inject()
        private readonly stripeService: StripeService,
        @Inject()
        private readonly paymentsService: PaymentsService,
        @Inject()
        private readonly dataSource: DataSource,
        entityManager: EntityManager,

    ) {
        super(enrolledCoursesRepo, entityManager);
    }

    /**
     * Enroll a course by Visa payment method
     * @param course_id - The ID of the course to enroll in
     * @param visaPaymentDataDto - The payment data DTO containing Visa payment information
     * @param account_id - The ID of the account making the payment
     */
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
            // check if the course is published and find the course
            const course = await this.getCourse(course_id, queryRunner);
            // insert into enrolled courses the course and account
            await this.addEnrolledCourse(course_id, account_id, queryRunner);

            this.logger.log('Course found, processing payment');
            // process payment in stripe
            const paymentIntent = await this.processPayment(course, visaPaymentDataDto, account_id);
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
            await this.addNewPaymentHistory(
                {
                    amount: course.price,
                    country: visaPaymentDataDto.country,
                    payment_method: visaPaymentDataDto.payment_method,
                    currency: 'usd',
                    status: 'success',
                    payment_intent_id: paymentIntent.id,
                    latest_charge_id: latest_charge,
                    payment_method_id: visaPaymentDataDto.paymentMethodId,
                    account: { id: account_id },
                },
                queryRunner,
            );
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

            throw e;
        } finally {
            await queryRunner.release();
            this.logger.log('Payment process completed');
        }
    }

    /**
     * Get course by ID and check if it is published
     * @param course_id - The ID of the course to retrieve
     * @param queryRunner - The query runner for database transactions
     * @returns The course entity
     * @throws NotFoundException if the course is not found or not published
     */
    private async getCourse(course_id: number, queryRunner: QueryRunner): Promise<Course> {
        const course = await queryRunner.manager.findOne(Course, {
            where: { id: course_id },
        });

        if (!course || course.state !== CourseStatusEnum.PUBLISHED) {
            throw new NotFoundException({
                message: 'Process payment failed, course not found or not published',
                details: 'Course not found or not published',
            });
        }
        return course;
    }

    /**
     * Insert a new enrolled course record
     * @param course_id
     * @param account_id
     * @param queryRunner
     * @private
     * @throws BadRequestException if the insertion fails
     */
    private async addEnrolledCourse(
        course_id: number,
        account_id: number,
        queryRunner: QueryRunner,
    ): Promise<void> {
        try {
            await queryRunner.manager.insert(EnrolledCourses, {
                account: { id: account_id },
                course: { id: course_id },
            });
        } catch (error) {
            this.logger.error('Error adding enrolled course', error);
            throw new BadRequestException({
                message: 'Process payment failed',
                details: 'Error adding enrolled course',
            });
        }
    }

    /**
     *
     * @param course
     * @param visaPaymentDataDto
     * @param account_id
     * @private
     * @return {Promise<Stripe.PaymentIntent>}
     * @throws {BadRequestException} if the payment processing fails
     */
    private async processPayment(
        course: Course,
        visaPaymentDataDto: VisaPaymentDataDto,
        account_id: number,
    ) {
        try {
            const metadata: PaymentMetadataI = {
                account_id: account_id.toString(),
                course_id: course.id.toString(),

                purchase_type: 'course enrollment',
                purchase_platform: 'web',
                enrollment_date: new Date().toISOString(),

                country: visaPaymentDataDto.country,
                price_paid: course.price.toString(),
                payment_method_type: 'visa',
            };

            return await this.stripeService.processPayment(
                course.price,
                visaPaymentDataDto.paymentMethodId,
                metadata,
            );
        } catch (error) {
            this.logger.error('Error processing payment', error);
            throw new BadRequestException({
                message: 'Process payment failed',
                details: 'Error processing payment',
            });
        }
    }

    /**
     * Add a new payment history entry
     * @param data - The payment history data to insert
     * @param queryRunner - The query runner for database transactions
     * @throws BadRequestException if the insertion fails
     */
    private async addNewPaymentHistory(data: any, queryRunner: QueryRunner) {
        // solve any issue later
        try {
            await queryRunner.manager.insert(PaymentsHistory, {
                ...data,
            });
        } catch (error) {
            this.logger.error('Error adding payment history', error);
            throw new BadRequestException({
                message: 'Process payment failed',
                details: 'Error adding payment history',
            });
        }
    }
}
