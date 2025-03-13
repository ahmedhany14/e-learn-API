import {Inject, Injectable} from '@nestjs/common';
import {CourseReviewRepository} from "../repository/coures.review.repo";

@Injectable()
export class ReviewCoursesService {
    constructor(
      @Inject()
      private readonly courseReviewRepository: CourseReviewRepository,
    ) { }
    async pushCourseToReview(course_id: number) {
        return this.courseReviewRepository.createCourseReview(course_id);
    }
}
