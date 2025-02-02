import {
  Body,
  Controller,
  Delete,
  Get,
  GoneException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';

// dto
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpgradeToInstructorDto } from './dtos/upgrade.to.instructor.dto';

// service
import { AccountService } from './service/account.service';
import { Email } from '../common/email/email';

// decorators
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { AccountEnum } from './entity/account.enum';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    @Inject() private readonly accountService: AccountService,
    @Inject() private readonly email: Email,
  ) {}

  @Get()
  async getAccountWithEmail(@Body('email') email: string) {
    this.logger.log('find account by email attempted');

    const select = [
      AccountEnum.EMAIL,
      AccountEnum.ROLE,
      AccountEnum.IS_ACTIVE,
      AccountEnum.CREATED_AT,
    ];

    const account = await this.accountService.findByEmail(email, select);

    if (!account) {
      throw new NotFoundException({
        message: 'Account not found',
        details: 'Account with the provided email does not exist',
      });
    }

    return { response: account };
  }

  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Delete('de-active-account')
  async deActive(@ExtractAccountData('id') id: number) {
    this.logger.log('de-activate account attempted');

    const select = [AccountEnum.ID, AccountEnum.IS_ACTIVE];

    const account = await this.accountService.findById(id, select);
    await this.accountService.flipActiveState(account);
    return { response: 'Account de-activated successfully' };
  }

  @AUTH(AuthEnum.BEARER)
  @Delete()
  async delete(@ExtractAccountData('id') id: number) {
    this.logger.log('delete account attempted');

    const select = [
      AccountEnum.ID,
      AccountEnum.EMAIL,
      AccountEnum.PASSWORD,
      AccountEnum.ROLE,
      AccountEnum.IS_ACTIVE,
    ];

    const account = await this.accountService.findById(id, select);
    await this.accountService.delete(account);
    return { response: 'Account deleted successfully' };
  }

  @ROLE(RoleEnum.USER)
  @AUTH(AuthEnum.BEARER)
  @Post('upgrade-to-instructor')
  async upgradeToInstructor(
    @Body() upgradeToInstructorDto: UpgradeToInstructorDto,
    @ExtractAccountData('id') id: number,
    @ExtractAccountData('email') email: string,
  ) {
    this.logger.log('upgrade to instructor attempted');


    const select = [AccountEnum.ID];

    const order = await this.accountService.upgradeToInstructor(
      id,
      upgradeToInstructorDto,
      select,
    );

    await this.email.sendOrderConfirmationEmail(email, order.id);

    return {
      response: 'Upgrade request sent successfully for review',
    };
  }
}
