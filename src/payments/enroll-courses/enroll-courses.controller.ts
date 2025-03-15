import { Body, Controller, Inject, Logger, Param, ParseIntPipe, Post } from '@nestjs/common';

import { ViasPaymentDataDto } from './dto/payment.data.dto';

// auth
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';

// services
import { EnrollCoursesService } from './services/enroll-courses.service';
import { ExtractAccountData } from 'src/common/decorators/request.extractData.decorator';
import { FacadePatternProcessPaymentsService } from '../patterns/facade.pattern.process.payments.service';

@Controller('enroll-courses')
export class EnrollCoursesController {
    private readonly logger = new Logger(EnrollCoursesController.name);

    constructor(
        @Inject()
        private readonly facadePatternProcessPaymentsService: FacadePatternProcessPaymentsService

    ) {
    }

    @AUTH(AuthEnum.BEARER)
    @Post('visa-checkout/:course_id')
    async enrollCourses(
        @Body() visaPaymentDataDto: ViasPaymentDataDto,
        @Param('course_id', ParseIntPipe) course_id: number,
        @ExtractAccountData('id') account_id: number
    ) {

        this.facadePatternProcessPaymentsService.enrollCoursesByVisa(
            course_id, visaPaymentDataDto, account_id
        );

        // redirect to course page with all course details (video, sections, etc)
        return 'Enroll courses';

    }
}
