import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

// repository
import { EntollCoursesRepo } from '../repository/entoll-courses.repo';

// services
import { StripeService } from 'src/payments/modules/stripe/stripe.service';
import { ViasPaymentDataDto } from '../dto/payment.data.dto';
import { CourseStatusEnum } from 'src/courses/enums/course.status.enum';
import { DataSource } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { EnrolledCourses } from '../entity/enrolled.courses.entity';
import { PaymentsHistory } from 'src/payments/entities/payments.history.entity';
import { PaymentsService } from 'src/payments/payments.service';

// enums and dtos

@Injectable()
export class EnrollCoursesService {
    private readonly logger = new Logger(EnrollCoursesService.name);

    constructor(
        @Inject()
        private readonly entollCoursesRepo: EntollCoursesRepo,

        @Inject()
        private readonly stripeService: StripeService,

        @Inject()
        private readonly paymentsService: PaymentsService,
        @Inject()
        private readonly dataSource: DataSource,
    ) {}

    createNewEnrolledCourse(account_id: number, course_id: number) {
        return this.entollCoursesRepo.createNewEnrolledCourse(account_id, course_id);
    }

    async enrollCoursesByVisa(
        course_id: number,
        visaPaymentDataDto: ViasPaymentDataDto,
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

            const enrolled_course = await queryRunner.manager.insert(EnrolledCourses, {
                account: { id: account_id },
                course: { id: course_id },
            });

            this.logger.log('Payment history created');
            const paymentsHistory = await queryRunner.manager.insert(PaymentsHistory, {
                amount: course.price,
                country: visaPaymentDataDto.country,
                payment_method: visaPaymentDataDto.payment_method,
                currency: 'usd',
                status: 'success',
                account: { id: account_id },
            });

            this.logger.log('Course found, processing payment');
            // process payment
            const paymentIntent = await this.stripeService.processPayment(
                course.price,
                visaPaymentDataDto.paymentMethodId,
            );
            latest_charge = paymentIntent.latest_charge as string;

            await this.paymentsService.createPaymentHistory({ status: 'failed' }, account_id);
            if (paymentIntent.status !== 'succeeded') {
                this.logger.log('Payment not succeeded');
                throw new BadRequestException({
                    message: 'Process payment failed',
                    details: 'Payment not succeeded',
                });
            }
            await queryRunner.commitTransaction();

            this.logger.log('Payment process completed');
        } catch (e) {
            this.logger.log('Payment process failed');
            await queryRunner.rollbackTransaction();

            if (latest_charge) {
                await this.stripeService.refundPayment(latest_charge);
                this.logger.log('Payment refunded');
            }

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
