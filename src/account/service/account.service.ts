import { Inject, Injectable, NotFoundException } from '@nestjs/common';

// Repository
import { AccountRepository } from '../repository/account.repository';
import { Account } from '../entity/account.entity';
import { PaymentAccountDetailsDto } from '../dtos/payment.account.details.dto';
import { RoleEnum } from '../../auth/enums/role.enum';

@Injectable()
export class AccountService {
    constructor(
        @Inject()
        private readonly accountRepository: AccountRepository,
    ) {}

    async findByEmail(email: string) {
        return await this.accountRepository.findOne({ email });
    }

    async findById(id: number) {
        return await this.accountRepository.findOne({ id });
    }

    async updateEmail(id: number, email: string) {
        return await this.accountRepository.findOneAndUpdate({ id }, { email });
    }

    async updatePassword(id: number, hashedPassword: string) {
        return await this.accountRepository.findOneAndUpdate({ id }, { password: hashedPassword });
    }

    async delete(id: number) {
        await this.accountRepository.findOneAndDelete({ id });
    }

    async activeAccount(id: number): Promise<Account> {
        return await this.accountRepository.findOneAndUpdate({ id }, { is_active: true });
    }

    async upgradeToInstructor(id: number, paymentAccountDetailsDto: PaymentAccountDetailsDto) {
        return await this.accountRepository.findOneAndUpdate(
            { id },
            {
                role: RoleEnum.INSTRUCTOR,
                payment_account_details: paymentAccountDetailsDto.payment_account_details,
            },
        );
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

    async getTotalInstructors(filter: any) {
        return await this.accountRepository.getTotalInstructors(filter);
    }
}
