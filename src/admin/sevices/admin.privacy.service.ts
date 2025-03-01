import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountService } from 'src/account/service/account.service';

import { AccountEnum } from 'src/account/entity/account.enum';

@Injectable()
export class AdminPrivacyService {

    constructor(
        @Inject() private readonly accountService: AccountService
    ) { }


    async bannAccount(
        account_id: number
    ) {
        const account = await this.accountService.findById(account_id, [AccountEnum.ID, AccountEnum.HAS_BEEN_BANNED, AccountEnum.EMAIL]);
        if (!account) {
            throw new NotFoundException({
                message: "Account not found",
            })
        }
        if (account.has_been_banned) {
            throw new ConflictException({
                message: "Account has already been banned",
            })
        }

        account.has_been_banned = true;

        return await this.accountService.save(account);
    }
}
