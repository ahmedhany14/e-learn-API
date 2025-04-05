import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    Inject,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';

// dto
import { PaymentAccountDetailsDto } from './dtos/payment.account.details.dto';

// service
import { AccountService } from './service/account.service';
import { TokenProvider } from '../auth/providers/token.provider';
import { Email } from '../common/email/email';

// decorators for auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { ROLE } from '../auth/decorators/role.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { RoleEnum } from '../auth/enums/role.enum';

// decorators
import { TokenIsInRedisGuard } from './guards/account.redis.guard';
import { AccountIsExistingDecorator } from './decorators/account.is_existing.decorator';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';


// guards
import { IsUniqueEmailGuard } from './guards/is.unique.email.guard';
import { Account } from './entity/account.entity';

@Controller('account')
export class AccountController {
    private readonly logger = new Logger(AccountController.name);

    constructor(
        @Inject() private readonly accountService: AccountService,
        @Inject() private readonly tokenProvider: TokenProvider,
        @Inject() private readonly email: Email,
    ) {}

    @AUTH(AuthEnum.BEARER)
    @Get()
    async getAccount(@ExtractAccountData() account: Account) {
        this.logger.log('find account by email attempted');
        return { response: account };
    }

    @UseGuards(IsUniqueEmailGuard)
    @AUTH(AuthEnum.BEARER)
    @Patch('change-email')
    async changeEmail(@ExtractAccountData() account_id: number, @Body('email') email: string) {
        this.logger.log('change email attempted');

        await this.accountService.updateEmail(account_id, email);
        return { response: 'Email changed successfully' };
    }

    @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
    @AUTH(AuthEnum.BEARER)
    @Delete('de-active-account')
    async deActive(@ExtractAccountData() account: Account) {
        this.logger.log('de-activate account attempted');

        await this.accountService.flipActiveState(account);

        return { response: 'Account de-activated successfully' };
    }

    @AUTH(AuthEnum.BEARER)
    @Delete()
    async delete(@ExtractAccountData('id') id: number) {
        this.logger.log('delete account attempted');

        await this.accountService.delete(id);

        return { response: 'Account deleted successfully' };
    }

    @Get('active-account/:account_id/:token')
    @UseGuards(TokenIsInRedisGuard)
    async activeAccount(@Param('account_id', ParseIntPipe, AccountIsExistingDecorator) id: number) {
        const account = await this.accountService.findById(id);
        await this.accountService.activeAccount(id);

        const { accessToken, refreshToken } = await this.tokenProvider.generateToken(account);

        return {
            response: {
                message: 'Account activated successfully',
                accessToken,
                refreshToken,
            },
        };
    }

    @Get('reset-active-token/:account_id')
    async resetActiveToken(
        @Param('account_id', ParseIntPipe, AccountIsExistingDecorator) id: number,
    ) {
        const account = await this.accountService.findById(id);

        if (account.is_active) {
            throw new ConflictException({
                message: 'Account already active',
                details: 'account you are trying to activate is already active, login to use it',
            });
        }

        const { url } = await this.tokenProvider.generate_active_token(account.id);

        return {
            response: {
                message: 'Token reset successfully',
                url,
            },
        };
    }

    @ROLE(RoleEnum.USER)
    @AUTH(AuthEnum.BEARER)
    @Post('upgrade-to-instructor')
    async upgradeToInstructor(
        @ExtractAccountData('id') account_id: number,
        @Body() paymentAccountDetailsDto: PaymentAccountDetailsDto,
    ) {
        await this.accountService.upgradeToInstructor(account_id, paymentAccountDetailsDto);

        return {
            response: 'Upgrade to instructor requested successfully',
        };
    }
}
