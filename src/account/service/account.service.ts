import { Inject, Injectable, NotFoundException } from '@nestjs/common';

// Repository
import { AccountRepository } from '../repository/account.repository';
import { Account } from '../entity/account.entity';
import { PaymentAccountDetailsDto } from '../dtos/payment.account.details.dto';
import { RoleEnum } from '../../auth/enums/role.enum';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class AccountService {
    constructor(
        @Inject()
        private readonly accountRepository: AccountRepository,
    ) {}

    async findByEmail(filter: FindOptionsWhere<Account>) {
        return await this.accountRepository.findOne(filter);
    }

    async findById(filter: FindOptionsWhere<Account>) {
        return await this.accountRepository.findOne(filter);
    }

    async updateEmail(filter: FindOptionsWhere<Account>, email: string) {
        return await this.accountRepository.findOneAndUpdate(filter, { email });
    }

    async updatePassword(filter: FindOptionsWhere<Account>, hashedPassword: string) {
        return await this.accountRepository.findOneAndUpdate(filter, { password: hashedPassword });
    }

    async delete(filter: FindOptionsWhere<Account>) {
        await this.accountRepository.findOneAndDelete(filter);
    }

    async activeAccount(filter: FindOptionsWhere<Account>): Promise<Account> {
        return await this.accountRepository.findOneAndUpdate(filter, { is_active: true });
    }

    async upgradeToInstructor(
        filter: FindOptionsWhere<Account>,
        paymentAccountDetailsDto: PaymentAccountDetailsDto,
    ) {
        return await this.accountRepository.findOneAndUpdate(filter, {
            role: RoleEnum.INSTRUCTOR,
            payment_account_details: paymentAccountDetailsDto.payment_account_details,
        });
    }

    async flipActiveState(account: Account) {
        account.is_active = !account.is_active;
        return await this.accountRepository.save(account);
    }

    async save(account: Account) {
        return await this.accountRepository.save(account);
    }

    async getTotalStudents(filter: any) {
        return await this.accountRepository.getTotalStudents(filter);
    }

    async getTotalInstructors(filter: FindOptionsWhere<Account>) {
        return await this.accountRepository.getTotalInstructors(filter);
    }
}
