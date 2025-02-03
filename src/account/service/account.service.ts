import {
  Inject,
  Injectable, NotFoundException,
} from '@nestjs/common';

// Service
import { AdminService } from '../../admin/sevices/admin.service';
import { OrdersService } from '../../orders/services/orders.service';

// Repository
import { AccountRepository } from '../repository/account.repository';
import { Account } from '../entity/account.entity';

// DTO
import { UpgradeToInstructorDto } from '../dtos/upgrade.to.instructor.dto';
import { IDeactivateAccount, IDeleteAccount, IUpgradeToInstructor } from '../interfaces/accounts.interface';

@Injectable()
export class AccountService {
  constructor(
    @Inject()
    private readonly accountRepository: AccountRepository,
    @Inject()
    private readonly orderService: OrdersService,
  ) {}

  async findByEmail(email: string, select: string[]) {
    return await this.accountRepository.findByEmail(email, select);
  }

  async findById(id: number, select: string[]) {
    return await this.accountRepository.findById(id, select);
  }

  async updatePassword(account: Account, password: string) {
    account.password = password;
    return await this.accountRepository.save(account);
  }

  async flipActiveState(account: IDeactivateAccount) {
    account.is_active = !account.is_active;
    return await this.accountRepository.save(account);
  }

  async delete(account: IDeleteAccount) {
    return await this.accountRepository.delete(account);
  }

  async upgradeToInstructor(
    account: IUpgradeToInstructor,
    upgradeToInstructorDto: UpgradeToInstructorDto,
  ) {
    return this.orderService.createOrder(upgradeToInstructorDto, account);
  }
}
