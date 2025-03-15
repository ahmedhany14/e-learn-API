import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';

// services
import { CourseService } from 'src/courses/service/course.service';
import { StripeService } from '../stripe/stripe.service';
import { PaymentsService } from '../payments.service';

// enums and dtos
import { CourseEnum } from 'src/courses/entities/course.enums';
import { CourseStatusEnum } from 'src/courses/enums/course.status.enum';
import { ViasPaymentDataDto } from '../enroll-courses/dto/payment.data.dto';
import { EnrollCoursesService } from '../enroll-courses/services/enroll-courses.service';

@Injectable()
export class FacadePatternProcessPaymentsService {
    private readonly logger = new Logger(FacadePatternProcessPaymentsService.name);

    constructor(
        @Inject()
        private readonly CourseService: CourseService,

        @Inject()
        private readonly stripeService: StripeService,

        @Inject()
        private readonly paymentsService: PaymentsService,

        @Inject()
        private readonly enrollCoursesService: EnrollCoursesService
    ) { }


    async enrollCoursesByVisa(course_id: number, visaPaymentDataDto: ViasPaymentDataDto, account_id: number) {
        // check if course exists

        try {

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

            const enrolled_course = await this.enrollCoursesService.createNewEnrolledCourse(
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
