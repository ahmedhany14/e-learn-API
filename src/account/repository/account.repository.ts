import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// Data base and ORM
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { Account } from '../entity/account.entity';

@Injectable()
export class AccountRepository {
  private readonly logger = new Logger(AccountRepository.name);

  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) { }

  async findByEmail(email: string, select: string[]): Promise<Account> {
    try {
      return await this.accountRepository.findOne({
        where: { email },
        select: select as FindOptionsSelect<Account>,
      });
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: err.message,
      });
    }
  }

  async findById(id: number, select: string[]): Promise<Account> {
    try {
      return await this.accountRepository.findOne({
        where: { id },
        select: select as FindOptionsSelect<Account>,
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    }
  }

  async updateEmail(id: number, email: string): Promise<void> {
    try {
      await this.accountRepository.update(id, { email });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    }
  }

  async save<T extends Partial<Account>>(account: T): Promise<Account> {
    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    }
  }

  async delete<T extends Partial<Account>>(account: T): Promise<void> {
    try {
      await this.accountRepository.remove(
        await this.accountRepository.findOne({
          where: { id: account.id },
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    } finally {
      this.logger.log(`Account with id ${account.id} has been deleted`);
    }
  }

  async activeAccount(account: Account): Promise<Account> {
    try {
      account.is_active = true;
      return await this.accountRepository.save(account);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    } finally {
      this.logger.log(`Account with id ${account.id} has been activated`);
    }
  }

  async getTotalStudents(filter: any): Promise<number> {
    try {
      return await this.accountRepository.count({
        where: { ...filter, role: 'user' },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    }
  }

  async getTotalInstructors(filter: any): Promise<number> {
    try {

      return await this.accountRepository
        .createQueryBuilder('account')
        .innerJoinAndSelect('account.instructor', 'instructor')
        .select('account.is_active' as string)
        .addSelect('account.has_been_banned' as string)
        .addSelect('account.role' as string)
        .where({ ...filter, role: 'instructor' })
        .getCount();
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: err.message,
      });
    }
  }
}
