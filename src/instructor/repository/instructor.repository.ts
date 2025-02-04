import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

// Data base and ORM
import { Repository, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from '../entity/instructor.entity';

// dto
import { UpdatePaymentsDto } from '../dtos/update.payments.dto';

@Injectable()
export class InstructorRepository {
  constructor(
    @InjectRepository(Instructor)
    private readonly instructorRepository: Repository<Instructor>,
  ) {}

  async getInstructorPaymentsByAccountId(account_id: number) {
    try {
      return this.instructorRepository
        .createQueryBuilder('instructor')
        .innerJoin('instructor.account', 'account')
        .where('account.id = :account_id', { account_id })
        .select([
          'instructor.payment_info as "payment_info"',
          'instructor.stripe_info as "stripe_info"',
        ])
        .getRawOne();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'unable to get instructor payments',
        details: 'server down try again later',
      });
    }
  }

  async updateInstructorPayments(
    account_id: number,
    updatePaymentsDto: UpdatePaymentsDto,
  ) {
    try {
      await this.instructorRepository
        .createQueryBuilder()
        .update('instructor')
        .set({
          payment_info: updatePaymentsDto.payment_info,
          stripe_info: updatePaymentsDto.stripe_info,
        })
        .where('account_id = :account_id', { account_id })
        .execute();
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException({
        message: 'unable to update instructor payments',
        details: 'server down try again later',
      });
    }
  }
}
