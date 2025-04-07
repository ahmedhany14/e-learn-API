import { Controller, Delete, Inject, Param, ParseIntPipe, Patch } from '@nestjs/common';

// decorators for auth
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

// Services
import { AdminPrivacyService } from './services/admin.privacy.service';

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('admin/privacy')
export class PrivacyController {
    constructor(@Inject() private readonly adminPrivacyService: AdminPrivacyService) {}

    // Ban
    @Delete('ban/:account_id')
    async banAccount(@Param('account_id', ParseIntPipe) account_id: number) {
        await this.adminPrivacyService.bannedAccount(account_id);
        // will be implemented later ......
        //await this.email.sendBannEmail(account.email)

        return {
            response: 'Account has been banned successfully',
        };
    }

    // Force de-active accounts
    @Delete('force-de-activate/:account_id')
    async deactivateAccount(@Param('account_id', ParseIntPipe) account_id: number) {
        await this.adminPrivacyService.deactivateAccount(account_id);
        // will be implemented later ......
        //await this.email.sendDeactivateEmail(account.email)
        return {
            response: 'Account has been deactivated successfully',
        };
    }

    // Force active accounts
    @Patch('force-activate/:account_id')
    async activateAccount(@Param('account_id', ParseIntPipe) account_id: number) {
        await this.adminPrivacyService.activateAccount(account_id);
        // will be implemented later ......
        //await this.email.sendDeactivateEmail(account.email)
        return {
            response: 'Account has been activated successfully',
        };
    }
}
