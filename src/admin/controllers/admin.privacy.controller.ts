import { Controller, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';

@Controller('admin')
export class AdminPrivacyController {

    constructor() {

    }


    // Ban
    @Patch('ban/:accout_id')
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

        return {
            response: 'Account has been banned successfully'
        }

    }
    // Force de-active accounts

    @Delete('force-de-activate/:accout_id')
    async deactivateAccount() {
        /*
            API end-point to deactivate an account temporarily
            Steps:
                1) Get the account id from the request
                2) Call the admin service to deactivate the account
                3) return a response to the client that the

        */

        return {
            response: 'Account has been deactivated successfully'
        }

    }

    // Force active accounts
    @Patch('force-activate/:accout_id')
    async activateAccount() {
        /*
            API end-point to activate an account
            Steps:
                1) Get the account id from the request
                2) Call the admin service to activate the account
                3) return a response to the client that the account has been activated successfully
        */

        return {
            response: 'Account has been activated successfully'
        }
    }
}
