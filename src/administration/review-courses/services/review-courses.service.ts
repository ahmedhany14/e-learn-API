import { Inject, Injectable } from '@nestjs/common';

// repository
import { CourseReviewRepository } from '../repository/coures.review.repo';

// transactions
import { ApproveCourseTransaction } from '../repository/transactions/approve.transaction';
import { RejectCourseTransaction } from '../repository/transactions/reject.transaction';
import { CloseCourseTransaction } from '../repository/transactions/close.transaction';

@Injectable()
export class ReviewCoursesService {
    constructor(
        @Inject()
        private readonly courseReviewRepository: CourseReviewRepository,
        @Inject()
        private readonly approveTransaction: ApproveCourseTransaction,
        @Inject()
        private readonly rejectTransaction: RejectCourseTransaction,
        @Inject()
        private readonly closeTransaction: CloseCourseTransaction,
    ) {}

    async getCourseReview(review_course_id: number, filter: any) {
        return this.courseReviewRepository.getCourseReview(review_course_id, filter);
    }

    async pushCourseToReview(course_id: number) {
        return this.courseReviewRepository.createCourseReview(course_id);
    }

    async getPushedCourses(filter: any) {
        return this.courseReviewRepository.getReviewCourses(filter);
    }

    async getPushedCourse(review_course_id: number) {
        return this.courseReviewRepository.getReviewCourse(review_course_id);
    }
    async approveCourse(admin_id: number, review_course_id: number) {
        return this.approveTransaction.approveCourse(admin_id, review_course_id);
    }

    async rejectCourse(admin_id: number, review_course_id: number) {
        return this.rejectTransaction.rejectCourse(admin_id, review_course_id);
    }
    async closeReview(admin_id: number, review_course_id: number) {
        return this.closeTransaction.closeCourse(admin_id, review_course_id);
    }
}
