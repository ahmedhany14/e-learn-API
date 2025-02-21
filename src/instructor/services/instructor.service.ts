import { Inject, Injectable } from '@nestjs/common';

// repository
import { InstructorRepository } from '../repository/instructor.repository';

// dto
import { UpdatePaymentsDto } from '../dtos/update.payments.dto';

// services
import { CourseService } from 'src/courses/service/course.service';
import { QueryDto } from '../dtos/my.courses.query.dto';

@Injectable()
export class InstructorService {
  constructor(
    @Inject()
    private readonly instructorRepository: InstructorRepository,

    @Inject()
    private readonly courseService: CourseService,
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

  async getMyCourses(filter: any, selec: string[], queryDto: QueryDto) {
    return await this.courseService.getMyCourses(filter, selec, queryDto);
  }
}
