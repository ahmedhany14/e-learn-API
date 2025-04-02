import {
    Body,
    Controller,
    Get,
    Inject,
    Logger,
    NotFoundException,
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
import * as console from 'node:console';
import { FeedbackDto } from './dtos/feedback.dto';

ROLE(RoleEnum.ADMIN);

@AUTH(AuthEnum.BEARER)
@Controller('admin/review-courses')
export class ReviewCoursesController {
    private readonly logger = new Logger(ReviewCoursesController.name);

    constructor(
        @Inject()
        private readonly reviewCoursesService: ReviewCoursesService,
    ) {}

    @Get('pushed-courses-to-review')
    async getPushed(@Query() reviewStateDto: ReviewStateDto) {
        console.log(reviewStateDto);
        const filter = reviewStateDto.state ? { state: reviewStateDto.state } : {};

        return {
            response: await this.reviewCoursesService.getPushedCourses(filter),
        };
    }

    @Get('pushed-course-to-review/:review_course_id')
    async getPushedCourse(@Param('review_course_id', ParseIntPipe) review_course_id: number) {
        let review_course = await this.reviewCoursesService.getPushedCourse(review_course_id);

        if (!review_course) {
            throw new NotFoundException({
                message: 'Course not found',
            });
        }

        const course = review_course.course;

        const sections = await course.sections;
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            (await section.videos).sort((a, b) => a.order - b.order);
        }
        sections.sort((a, b) => a.order - b.order);

        return {
            response: {
                course,
            },
        };
    }

    @UseGuards(IsReadyForReviewGuard)
    @Post('approve-course/:review_course_id')
    async approveCourse(
        @ExtractAccountData('id') admin_id: number,
        @Param('review_course_id', ParseIntPipe) review_course_id: number,
    ) {
        await this.reviewCoursesService.approveCourse(admin_id, review_course_id);

        // send email to instructor that course is approved
        /*
         will be implemented soon
         */

        return {
            response: 'Course approved successfully',
        };
    }

    @UseGuards(IsReadyForReviewGuard)
    @Post('reject-course/:review_course_id')
    async rejectCourse(
        @ExtractAccountData('id') admin_id: number,
        @Param('review_course_id', ParseIntPipe) review_course_id: number,
    ) {
        await this.reviewCoursesService.rejectCourse(admin_id, review_course_id);

        // email instructor that course is rejected
        /*
         will be implemented soon
         */
        return {
            response: 'Course rejected successfully',
        };
    }

    @UseGuards(IsReadyForReviewGuard)
    @Post('reverse-course-and-send-feedback/:review_course_id')
    async sendFeedback(
        @ExtractAccountData('id') admin_id: number,
        @Param('review_course_id', ParseIntPipe) review_course_id: number,
        @Body() feedback: FeedbackDto,
    ) {
        await this.reviewCoursesService.closeReview(admin_id, review_course_id);

        this.logger.log(`feedback: ${feedback.feedback}`);
        /*
         send to instructor that course is reversed
         to draft state to make changes that satisfy the requirements with the feedback
         */
        return {
            response: 'course reversed and feedback sent successfully',
        };
    }
}
