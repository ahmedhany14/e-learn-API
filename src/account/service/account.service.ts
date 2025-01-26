import { Inject, Injectable } from '@nestjs/common';

// Repository
import { AccountRepository } from '../repository/account.repository';

// DTO
import { CreateAccountDto } from '../dtos/create-account.dto';

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
}
