import { Body, Controller, Param, Post } from '@nestjs/common';

import { ViasPaymentDataDto } from './dto/payment.data.dto';

@Controller('enroll-courses')
export class EnrollCoursesController {

    constructor() {
    }

    @Post('visa-checkout/:course_id')
    async enrollCourses(
        @Body() cisaPaymentDataDto: ViasPaymentDataDto,
        @Param('course_id') course_id: string
    ) {
        
        return 'Enroll courses';
    }
}
