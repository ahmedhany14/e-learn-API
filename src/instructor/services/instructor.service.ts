import { Inject, Injectable } from '@nestjs/common';

// repository
import { InstructorRepository } from '../repository/instructor.repository';

// dto
import { UpdatePaymentsDto } from '../dtos/update.payments.dto';

// services
import { ReviewCoursesService } from '../../administration/review-courses/services/review-courses.service';

@Injectable()
export class InstructorService {
    constructor(
        @Inject()
        private readonly instructorRepository: InstructorRepository,

        @Inject()
        private readonly reviewCoursesService: ReviewCoursesService,
    ) {}

    async getPayments(account_id: number) {
        return await this.instructorRepository.getInstructorPaymentsByAccountId(account_id);
    }

    async updatePayments(account_id: number, updatePaymentsDto: UpdatePaymentsDto) {
        return await this.instructorRepository.updateInstructorPayments(
            account_id,
            updatePaymentsDto,
        );
    }

    async pushCourseForReview(course_id: number) {
        return await this.reviewCoursesService.pushCourseToReview(course_id);
    }
}
