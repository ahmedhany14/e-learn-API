import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountService } from 'src/account/service/account.service';

@Injectable()
export class AdminPrivacyService {
    constructor(@Inject() private readonly accountService: AccountService) {}

    async bannedAccount(id: number) {
        const account = await this.accountService.findById({ id });
        if (!account) {
            throw new NotFoundException({
                message: 'Account not found',
            });
        }
        if (account.has_been_banned) {
            throw new ConflictException({
                message: 'Account has already been banned',
            });
        }

        account.has_been_banned = true;

        return await this.accountService.save(account);
    }

    async deactivateAccount(id: number) {
        const account = await this.accountService.findById({ id });
        if (!account) {
            throw new NotFoundException({
                message: 'Account not found',
            });
        }
        if (!account.is_active) {
            throw new ConflictException({
                message: 'Account has already been deactivated before',
            });
        }
        account.is_active = false;
        await this.accountService.save(account);
    }

    async activateAccount(id: number) {
        const account = await this.accountService.findById({ id });
        if (!account) {
            throw new NotFoundException({
                message: 'Account not found',
            });
        }
        if (account.is_active) {
            throw new ConflictException({
                message: 'Account has already been activated before',
            });
        }
        account.is_active = true;
        await this.accountService.save(account);
    }
}
