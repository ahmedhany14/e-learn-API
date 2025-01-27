import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

// Data base and ORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entity/account.entity';

// DTO
import { CreateAccountDto } from '../dtos/create-account.dto';

// Auth provider
import { Hashing } from '../../auth/interfaces/Hashing';
import { AccountSignupDto } from '../../auth/dto/account.signup.dto';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @Inject(forwardRef(() => Hashing))
    private readonly hashing: Hashing,
  ) {}

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

  async signup(accountSignupDto: AccountSignupDto): Promise<Account> {
    accountSignupDto.password = await this.hashing.hash(
      accountSignupDto.password,
    );
    accountSignupDto.confirmPassword = undefined;
    try {
      const account = this.accountRepository.create({
        ...accountSignupDto,
        isActive: true,
      });
      const res = await this.accountRepository.save(account);
      res.password = undefined;
      return res;
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async findByEmail(email: string): Promise<Account> {
    try {
      return await this.accountRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'role', 'isActive'],
      });
    } catch (err) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async findById(id: number): Promise<Account> {
    try {
      return await this.accountRepository.findOne({
        where: { id },
        select: ['id', 'email', 'password', 'role', 'isActive'],
      });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async save(account: Account): Promise<Account> {
    try {
      return await this.accountRepository.save(account);
    }
    catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
