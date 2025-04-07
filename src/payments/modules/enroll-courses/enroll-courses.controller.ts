import { Body, Controller, Inject, Logger, Param, ParseIntPipe, Post } from '@nestjs/common';

import { VisaPaymentDataDto } from './dto/payment.data.dto';

// auth
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';

// services
import { EnrollCoursesService } from './services/enroll-courses.service';
import { ExtractAccountData } from '@app/decorators';

@Controller('enroll-courses')
export class EnrollCoursesController {
    private readonly logger = new Logger(EnrollCoursesController.name);

    constructor(
        @Inject()
        private readonly enrollCoursesService: EnrollCoursesService,
    ) {}

    @AUTH(AuthEnum.BEARER)
    @Post('visa-checkout/:course_id')
    async enrollCourses(
        @Body() visaPaymentDataDto: VisaPaymentDataDto,
        @Param('course_id', ParseIntPipe) course_id: number,
        @ExtractAccountData('id') account_id: number,
    ) {
        // enroll courses
        await this.enrollCoursesService.enrollCoursesByVisa(
            course_id,
            visaPaymentDataDto,
            account_id,
        );
        return {
            response: 'Course enrolled successfully',
        };
    }
}
