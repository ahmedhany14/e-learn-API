import { Inject, Injectable } from '@nestjs/common';

// services
import { ReviewCoursesService } from '../../administration/review-courses/services/review-courses.service';

@Injectable()
export class InstructorService {
    constructor(
        @Inject()
        private readonly reviewCoursesService: ReviewCoursesService,
    ) {}

    async pushCourseForReview(course_id: number) {
        return await this.reviewCoursesService.pushCourseToReview(course_id);
    }
}
