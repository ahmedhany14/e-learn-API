import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// dto
import { UpgradeToInstructorDto } from './dtos/upgrade.to.instructor.dto';

// service
import { AccountService } from './service/account.service';
import { TokenProvider } from '../auth/providers/token.provider';
import { Email } from '../common/email/email';

// decorators for auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { ROLE } from '../auth/decorators/role.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { RoleEnum } from '../auth/enums/role.enum';
import { AccountEnum } from './entity/account.enum';

// decorators
import { TokenIsInRedisGuard } from './guards/account.redis.guard';
import { AccountIsExistingDecorator } from './decorators/account.is_existing.decorator';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { ACCOUNT_SELECT } from './decorators/account.select.decorator';

// interceptors
import { ExtractAccountInterceptor } from './interceptors/extract.account.interceptor';

// interfaces
import {
  SafeGetAccount,
  SafeDeactivateAccount,
  SafeDeleteAccount,
  SafeUpgradeToInstructor,
} from './interfaces/accounts.interface';

@UseInterceptors(ExtractAccountInterceptor)
@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    @Inject() private readonly accountService: AccountService,
    @Inject() private readonly tokenProvider: TokenProvider,
    @Inject() private readonly email: Email,
  ) {}

  @ACCOUNT_SELECT(
    AccountEnum.ID,
    AccountEnum.EMAIL,
    AccountEnum.ROLE,
    AccountEnum.IS_ACTIVE,
  )
  @AUTH(AuthEnum.BEARER)
  @Get()
  async getAccount(@ExtractAccountData() account: SafeGetAccount) {
    this.logger.log('find account by email attempted');
    return { response: account };
  }

  @ACCOUNT_SELECT(AccountEnum.ID, AccountEnum.IS_ACTIVE)
  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Delete('de-active-account')
  async deActive(@ExtractAccountData() account: SafeDeactivateAccount) {
    this.logger.log('de-activate account attempted');

    await this.accountService.flipActiveState(account);

    return { response: 'Account de-activated successfully' };
  }

  @ACCOUNT_SELECT(
    AccountEnum.ID,
    AccountEnum.EMAIL,
    AccountEnum.ROLE,
    AccountEnum.IS_ACTIVE,
  )
  @AUTH(AuthEnum.BEARER)
  @Delete()
  async delete(@ExtractAccountData() account: SafeDeleteAccount) {
    this.logger.log('delete account attempted');

    await this.accountService.delete(account);

    return { response: 'Account deleted successfully' };
  }

  @ACCOUNT_SELECT(AccountEnum.ID)
  @ROLE(RoleEnum.USER)
  @AUTH(AuthEnum.BEARER)
  @Post('upgrade-to-instructor')
  async upgradeToInstructor(
    @Body() upgradeToInstructorDto: UpgradeToInstructorDto,
    @ExtractAccountData() account: SafeUpgradeToInstructor,
  ) {
    this.logger.log('upgrade to instructor attempted');

    const order = await this.accountService.upgradeToInstructor(
      account,
      upgradeToInstructorDto,
    );

    await this.email.sendOrderConfirmationEmail(account.email, order.id);

    return {
      response: 'Upgrade request sent successfully for review',
    };
  }

  @Get('active-account/:account_id/:token')
  @UseGuards(TokenIsInRedisGuard)
  async activeAccount(
    @Param('account_id', ParseIntPipe, AccountIsExistingDecorator)
    account_id: number,
  ) {
    const select = [
      AccountEnum.ID,
      AccountEnum.IS_ACTIVE,
      AccountEnum.EMAIL,
      AccountEnum.ROLE,
    ];

    const account = await this.accountService.findById(account_id, select);
    await this.accountService.activeAccount(account);

    const { accessToken, refreshToken } =
      await this.tokenProvider.generateToken(account);

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
    @Param('account_id', ParseIntPipe, AccountIsExistingDecorator)
    account_id: number,
  ) {
    const select = [
      AccountEnum.ID,
      AccountEnum.IS_ACTIVE,
      AccountEnum.EMAIL,
      AccountEnum.ROLE,
    ];
    const account = await this.accountService.findById(account_id, select);

    if (account.is_active) {
      throw new ConflictException({
        message: 'Account already active',
        details:
          'account you are trying to activate is already active, login to use it',
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
}
