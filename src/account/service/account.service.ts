import { Inject, Injectable } from '@nestjs/common';

// Repository
import { AccountRepository } from '../repository/account.repository';

// DTO
import { CreateAccountDto } from '../dtos/create-account.dto';
import { AccountSignupDto } from '../../auth/dto/account.signup.dto';
import { Account } from '../entity/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @Inject()
    private readonly accountRepository: AccountRepository,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    return await this.accountRepository.create(createAccountDto);
  }

  async findByEmail(email: string) {
    return await this.accountRepository.findByEmail(email);
  }

  async findById(id: number) {
    return await this.accountRepository.findById(id);
  }

  async signup(accountSignupDto: AccountSignupDto) {
    return await this.accountRepository.signup(accountSignupDto);
  }

  async updatePassword(account: Account, password: string) {
    account.password = password;
    return await this.accountRepository.save(account);
  }
}
