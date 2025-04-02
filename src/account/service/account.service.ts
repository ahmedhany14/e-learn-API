import { Inject, Injectable, NotFoundException } from '@nestjs/common';

// Repository
import { AccountRepository } from '../repository/account.repository';
import { Account } from '../entity/account.entity';
import { AccountEnum } from '../entity/account.enum';

@Injectable()
export class AccountService {
    constructor(
        @Inject()
        private readonly accountRepository: AccountRepository,
    ) {}

    async findByEmail(
        email: string,
        select: string[] = [AccountEnum.EMAIL, AccountEnum.ROLE, AccountEnum.IS_ACTIVE],
    ) {
        return await this.accountRepository.findByEmail(email, select);
    }

    async findById(
        id: number,
        select: string[] = [AccountEnum.EMAIL, AccountEnum.ROLE, AccountEnum.IS_ACTIVE],
    ) {
        return await this.accountRepository.findById(id, select);
    }

    async updatePassword<T extends Partial<Account>>(account: T, hashedPassword: string) {
        account.password = hashedPassword;
        return await this.accountRepository.save(account);
    }

    async updateEmail(id: number, email: string) {
        return await this.accountRepository.updateEmail(id, email);
    }

    async flipActiveState<T extends Partial<Account>>(account: T) {
        account.is_active = !account.is_active;
        return await this.accountRepository.save(account);
    }

    async save<T extends Partial<Account>>(account: T) {
        return await this.accountRepository.save(account);
    }

    async delete<T extends Partial<Account>>(account: T) {
        return await this.accountRepository.delete(account);
    }

    async activeAccount(account: Account): Promise<Account> {
        return await this.accountRepository.activeAccount(account);
    }

    async getTotalStudents(filter: any) {
        return await this.accountRepository.getTotalStudents(filter);
    }

    async getTotalInstructors(filter: any) {
        return await this.accountRepository.getTotalInstructors(filter);
    }
}
