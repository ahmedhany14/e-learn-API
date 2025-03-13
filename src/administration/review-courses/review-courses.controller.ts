import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ReviewCoursesService } from './services/review-courses.service';
import { ReviewStateDto } from './dtos/review.state.dto';

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

    @Post('approve-course/:course_id')
    async approveCourse() {
        return {
            response: 'wll be implemented soon',
        };
    }

    @Post('reject-course/:course_id')
    async rejectCourse() {
        return {
            response: 'wll be implemented soon',
        };
    }

    @Post('send-feedback/:course_id')
    async sendFeedback() {
        return {
            response: 'wll be implemented soon',
        };
    }
}
