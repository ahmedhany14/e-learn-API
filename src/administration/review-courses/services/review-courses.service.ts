import { Inject, Injectable } from '@nestjs/common';

// repository
import { CourseReviewRepository } from '../repository/coures.review.repo';

// transactions
import { ApproveCourseTransaction } from '../repository/transactions/approve.transaction';
import { RejectCourseTransaction } from '../repository/transactions/reject.transaction';
import { CloseCourseTransaction } from '../repository/transactions/close.transaction';
import { FindOptionsWhere } from 'typeorm';
import { CourseReview } from '../entity/course.reviwe.entity';

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

    async find(filter: FindOptionsWhere<CourseReview>) {
        return this.courseReviewRepository.find(filter);
    }

    async findOne(filter: FindOptionsWhere<CourseReview>) {
        return this.courseReviewRepository.findOne(filter);
    }

    async pushCourseToReview(course_id: number) {
        return this.courseReviewRepository.createCourseReview(course_id);
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
