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
    @Delete('ban/:id')
    async banAccount(@Param('id', ParseIntPipe) id: number) {
        await this.adminPrivacyService.bannedAccount(id);
        // will be implemented later ......
        //await this.email.sendBanEmail(account.email)

        return {
            response: 'Account has been banned successfully',
        };
    }

    // Force de-active accounts
    @Delete('force-de-activate/:id')
    async deactivateAccount(@Param('id', ParseIntPipe) id: number) {
        await this.adminPrivacyService.deactivateAccount(id);
        // will be implemented later ......
        //await this.email.sendDeactivateEmail(account.email)
        return {
            response: 'Account has been deactivated successfully',
        };
    }

    // Force active accounts
    @Patch('force-activate/:id')
    async activateAccount(@Param('id', ParseIntPipe) id: number) {
        await this.adminPrivacyService.activateAccount(id);
        // will be implemented later ......
        //await this.email.sendDeactivateEmail(account.email)
        return {
            response: 'Account has been activated successfully',
        };
    }
}
