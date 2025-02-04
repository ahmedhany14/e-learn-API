import { Inject, Injectable } from '@nestjs/common';

// repository
import { InstructorRepository } from '../repository/instructor.repository';

// dto
import { UpdatePaymentsDto } from '../dtos/update.payments.dto';

@Injectable()
export class InstructorService {
  constructor(
    @Inject()
    private readonly instructorRepository: InstructorRepository,
  ) {}

  async getPayments(account_id: number) {
    return await this.instructorRepository.getInstructorPaymentsByAccountId(
      account_id,
    );
  }

  async updatePayments(account_id: number, updatePaymentsDto: UpdatePaymentsDto) {
    return await this.instructorRepository.updateInstructorPayments(
      account_id,
      updatePaymentsDto,
    );
  }

}
