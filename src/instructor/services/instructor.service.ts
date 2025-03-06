import { Inject, Injectable } from '@nestjs/common';

// repository
import { InstructorRepository } from '../repository/instructor.repository';

// dto
import { UpdatePaymentsDto } from '../dtos/update.payments.dto';

// services
import { CourseService } from 'src/courses/service/course.service';
import { QueryDto } from '../dtos/my.courses.query.dto';
import { AdminService } from 'src/admin/sevices/admin.service';

@Injectable()
export class InstructorService {
  constructor(
    @Inject()
    private readonly instructorRepository: InstructorRepository,

    @Inject()
    private readonly courseService: CourseService,

    @Inject()
    private readonly adminService: AdminService,
  ) {}

  async getPayments(account_id: number) {
    return await this.instructorRepository.getInstructorPaymentsByAccountId(
      account_id,
    );
  }

  async updatePayments(
    account_id: number,
    updatePaymentsDto: UpdatePaymentsDto,
  ) {
    return await this.instructorRepository.updateInstructorPayments(
      account_id,
      updatePaymentsDto,
    );
  }

  async pushCourseForReview(course_id: number) {
    return await this.adminService.pushCourseToReview(course_id);
  }
}
