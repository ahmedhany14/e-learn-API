import { Controller, Delete, Inject, Param, ParseIntPipe, Patch } from '@nestjs/common';


// Auth and Role
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { ROLE } from 'src/auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { RoleEnum } from 'src/auth/enums/role.enum';

// Services
import { AdminPrivacyService } from '../sevices/admin.privacy.service';
import { Email } from 'src/common/email/email';

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('admin')
export class AdminPrivacyController {

    constructor(
        @Inject() private readonly adminPrivacyService: AdminPrivacyService,
        @Inject() private readonly email: Email
    ) {
    }


    // Ban
    @Delete('ban/:accout_id')
    async banAccount(
        @Param('accout_id', ParseIntPipe) account_id: number
    ) {
        /*
        API end-point to ban an account
        Steps:
            1) Get the account id from the request
            2) Call the admin service to ban the account
            3) send an email to the account owner that their account has been banned
            4) return a response to the client that the account has been banned 
        */

        const account = await this.adminPrivacyService.bannAccount(account_id);


        // will be implemented later ......
        //await this.email.sendBannEmail(account.email)

        return {
            response: 'Account has been banned successfully'
        }

    }

    // Force de-active accounts
    @Delete('force-de-activate/:accout_id')
    async deactivateAccount(
        @Param('accout_id', ParseIntPipe) account_id: number
    ) {
        /*
            API end-point to deactivate an account temporarily
            Steps:
                1) Get the account id from the request
                2) Call the admin service to deactivate the account
                3) return a response to the client that the

        */

        const account = await this.adminPrivacyService.deactivateAccount(
            account_id
        );

        // will be implemented later ......
        //await this.email.sendDeactivateEmail(account.email)

        return {
            response: 'Account has been deactivated successfully'
        }

    }

    // Force active accounts
    @Patch('force-activate/:accout_id')
    async activateAccount(
        @Param('accout_id', ParseIntPipe) account_id: number
    ) {
        /*
            API end-point to activate an account
            Steps:
                1) Get the account id from the request
                2) Call the admin service to activate the account
                3) return a response to the client that the account has been activated successfully
        */
        const account = await this.adminPrivacyService.activateAccount(
            account_id
        );

        // will be implemented later ......
        //await this.email.sendDeactivateEmail(account.email)

        return {
            response: 'Account has been activated successfully'
        }
    }
}
