import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

// services
import { ReviewCoursesService } from './services/review-courses.service';

// dtos
import { ReviewStateDto } from './dtos/review.state.dto';

// auth and roles decorators
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';
import { ROLE } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';
import { ExtractAccountData } from '../../common/decorators/request.extractData.decorator';
import { IsReadyForReviewGuard } from './guards/is.ready.for.review.guard';

ROLE(RoleEnum.ADMIN);

@AUTH(AuthEnum.BEARER)
@Controller('admin/review-courses')
export class ReviewCoursesController {
    constructor(
        @Inject()
        private readonly reviewCoursesService: ReviewCoursesService,
    ) {}

    @Get('pushed-course-to-review')
    async getPushed(@Query() reviewStateDto: ReviewStateDto) {
        const filter = reviewStateDto.state ? { state: reviewStateDto.state } : {};

        return {
            response: await this.reviewCoursesService.getPushedCourses(filter),
        };
    }

    @UseGuards(IsReadyForReviewGuard)
    @Post('approve-course/:course_id')
    async approveCourse(
        @ExtractAccountData('id') admin_id: number,
        @Param('course_id', ParseIntPipe) course_id: number,
    ) {
        await this.reviewCoursesService.approveCourse(admin_id, course_id);

        // send email to instructor that course is approved
        /*
         will be implemented soon
         */

        return {
            response: 'Course approved successfully',
        };
    }

    @UseGuards(IsReadyForReviewGuard)
    @Post('reject-course/:course_id')
    async rejectCourse(
        @ExtractAccountData('id') admin_id: number,
        @Param('course_id', ParseIntPipe) course_id: number,
    ) {
        await this.reviewCoursesService.rejectCourse(course_id, admin_id);

        // email instructor that course is rejected
        /*
         will be implemented soon
         */
        return {
            response: 'wll be implemented soon',
        };
    }

    @UseGuards(IsReadyForReviewGuard)
    @Post('reverse-course-and-send-feedback/:course_id')
    async sendFeedback(
        @ExtractAccountData('id') admin_id: number,
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() feedback: string,
    ) {
        await this.reviewCoursesService.closeReview(course_id, admin_id);

        /*
         send to instructor that course is reversed
         to draft state to make changes that satisfy the requirements with the feedback
         */
        return {
            response: 'wll be implemented soon',
        };
    }
}
