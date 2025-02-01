import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// Data base and ORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entity/account.entity';

// DTO
import { CreateAccountDto } from '../dtos/create-account.dto';

// Auth provider
import { Hashing } from '../../auth/interfaces/Hashing';

@Injectable()
export class AccountRepository {
  private readonly logger = new Logger(AccountRepository.name);

  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @Inject(forwardRef(() => Hashing))
    private readonly hashing: Hashing,
  ) {}

  async createAdmin(admin: any): Promise<Account> {
    try {
      const account = this.accountRepository.create({
        email: admin.email,
        password: admin.password,
        role: 'admin',
      });

      return await this.accountRepository.save(account);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    }
  }

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    createAccountDto.password = await this.hashing.hash(
      createAccountDto.password,
    );
    const account = this.accountRepository.create({
      ...createAccountDto,
    });
    const res = await this.accountRepository.save(account);
    res.password = undefined;
    return res;
  }

  async findByEmail(email: string): Promise<Account> {
    try {
      return await this.accountRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'role', 'isActive'],
      });
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: err.message,
      });
    }
  }

  async findById(id: number): Promise<Account> {
    try {
      return await this.accountRepository.findOne({
        where: { id },
        select: ['id', 'email', 'password', 'role', 'isActive'],
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    }
  }

  async save(account: Account): Promise<Account> {
    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: error.message,
      });
    }
  }

  async delete(account: Account): Promise<void> {
    try {
      await this.accountRepository.remove(account);
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
