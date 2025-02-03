import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Post,
  UseInterceptors,
} from '@nestjs/common';

// dto
import { UpgradeToInstructorDto } from './dtos/upgrade.to.instructor.dto';

// service
import { AccountService } from './service/account.service';
import { Email } from '../common/email/email';

// decorators
import { AUTH } from '../auth/decorators/auth.decorator';
import { ACCOUNT_SELECT } from './decorators/account.select.decorator';
import { ROLE } from '../auth/decorators/role.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { RoleEnum } from '../auth/enums/role.enum';
import { AccountEnum } from './entity/account.enum';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

// interceptors
import { ExtractAccountInterceptor } from './interceptors/extract.account.interceptor';

// interfaces
import {
  IGetAccount,
  IDeactivateAccount,
  IDeleteAccount,
  IUpgradeToInstructor,
} from './interfaces/accounts.interface';

@UseInterceptors(ExtractAccountInterceptor)
@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    @Inject() private readonly accountService: AccountService,
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
  async getAccount(@ExtractAccountData() account: IGetAccount) {
    this.logger.log('find account by email attempted');
    return { response: account };
  }

  @ACCOUNT_SELECT(AccountEnum.ID, AccountEnum.IS_ACTIVE)
  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Delete('de-active-account')
  async deActive(@ExtractAccountData() account: IDeactivateAccount) {
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
  async delete(@ExtractAccountData() account: IDeleteAccount) {
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
    @ExtractAccountData() account: IUpgradeToInstructor,
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
}
