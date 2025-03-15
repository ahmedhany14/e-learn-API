import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

// repository
import { EntollCoursesRepo } from '../repository/entoll-courses.repo';

// services
import { StripeService } from 'src/payments/stripe/stripe.service';
import { PaymentsService } from 'src/payments/payments.service';
import { CourseService } from 'src/courses/service/course.service';
import { ViasPaymentDataDto } from '../dto/payment.data.dto';
import { CourseEnum } from 'src/courses/entities/course.enums';
import { CourseStatusEnum } from 'src/courses/enums/course.status.enum';

// enums and dtos


@Injectable()
export class EnrollCoursesService {
    private readonly logger = new Logger(EnrollCoursesService.name);

    constructor(
        @Inject()
        private readonly entollCoursesRepo: EntollCoursesRepo,

        @Inject()
        private readonly CourseService: CourseService,

        @Inject()
        private readonly stripeService: StripeService,

        @Inject()
        private readonly paymentsService: PaymentsService,

    ) { }

    createNewEnrolledCourse(account_id: number, course_id: number) {
        return this.entollCoursesRepo.createNewEnrolledCourse(account_id, course_id);
    }


    async enrollCoursesByVisa(course_id: number, visaPaymentDataDto: ViasPaymentDataDto, account_id: number) {
        try {
            // check if course exists

            const course = await this.CourseService.getCourse(
                [CourseEnum.ID, CourseEnum.PRICE, CourseEnum.STATE],
                [],
                course_id
            );

            if (!course || course.state !== CourseStatusEnum.PUBLISHED) {
                throw new NotFoundException({
                    message: 'Process payment failed, course not found or not published',
                });
            }

            // process payment
            const paymentIntent = await this.stripeService.processPayment(
                course.price,
                visaPaymentDataDto.paymentMethodId
            );

            if (paymentIntent.status !== 'succeeded') {
                throw new BadRequestException({
                    message: 'Process payment failed',
                    details: 'Payment not succeeded',
                });
            }

            // add course to account as enrolled course

            const enrolled_course = await this.createNewEnrolledCourse(
                account_id, course_id
            );
            await this.paymentsService.createPaymentHistory(
                {
                    amount: course.price,
                    country: visaPaymentDataDto.country,
                    currency: 'usd',
                    status: 'success',
                },
                account_id
            );

        }
        catch (e) {
            throw new BadRequestException({
                message: 'Process payment failed',
                details: e.message,
            });
        } finally {
            this.logger.log('Payment process completed');
        }
        // create PaymentHistory with stripe, and save it

    }

}
