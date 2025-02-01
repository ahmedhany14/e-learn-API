import { Inject, Injectable } from '@nestjs/common';

// Service
import { AdminService } from '../../admin/sevices/admin.service';

// Repository
import { AccountRepository } from '../repository/account.repository';
import { Account } from '../entity/account.entity';

// DTO
import { CreateAccountDto } from '../dtos/create-account.dto';
import { UpgradeToInstructorDto } from '../dtos/upgrade.to.instructor.dto';

@Injectable()
export class AccountService {
  constructor(
    @Inject()
    private readonly accountRepository: AccountRepository,
    private readonly adminService: AdminService,
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

  async upgradeToInstructor(
    accountId: number,
    upgradeToInstructorDto: UpgradeToInstructorDto,
  ) {
    const account = await this.accountRepository.findById(accountId);

    const order = this.adminService.createOrder(
      upgradeToInstructorDto,
      account,
    );

    return order;
  }
}
