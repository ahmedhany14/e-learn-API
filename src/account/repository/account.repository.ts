import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
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

  async findByEmail(email: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async findById(id: number): Promise<Account> {
    try {
      const account = await this.accountRepository.findOne({
        where: { id },
      });
      if (!account) throw new NotFoundException('Account not found');
      return account;
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }
}
