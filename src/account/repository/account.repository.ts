import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// Data base and ORM
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { Account } from '../entity/account.entity';
import {
  IDeactivateAccount,
  IDeleteAccount,
} from '../interfaces/accounts.interface';

@Injectable()
export class AccountRepository {
  private readonly logger = new Logger(AccountRepository.name);

  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

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

  async save(account: IDeactivateAccount): Promise<Account> {
    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    }
  }

  async delete(account: IDeleteAccount): Promise<void> {
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
}
