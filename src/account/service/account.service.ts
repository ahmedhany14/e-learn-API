import { Inject, Injectable } from '@nestjs/common';

// Repository
import { AccountRepository } from '../repository/account.repository';

// DTO
import { CreateAccountDto } from '../dtos/create-account.dto';
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

  async updatePassword(account: Account, password: string) {
    account.password = password;
    return await this.accountRepository.save(account);
  }

  async flipActiveState(account: Account) {
    account.isActive = !account.isActive;
    return await this.accountRepository.save(account);
  }

  async delete(account: Account) {
    return await this.accountRepository.delete(account);
  }

}
