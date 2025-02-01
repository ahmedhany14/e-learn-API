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

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    @Inject() private readonly accountService: AccountService,
    @Inject() private readonly email: Email,
  ) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    this.logger.log('create account attempted');

    this.logger.log('createAccountDto', createAccountDto);
    return await this.accountService.create(createAccountDto);
  }

  @Get()
  async findByEmail(@Body('email') email: string) {
    this.logger.log('find account by email attempted');

    return await this.accountService.findByEmail(email);
  }

  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Delete('deactive-account')
  async deActive(@ExtractAccountData('id') id: number) {
    this.logger.log('de-activate account attempted');

    try {
      const account = await this.accountService.findById(id);
      await this.accountService.flipActiveState(account);
      return 'Account de-activated successfully';
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException({
        message: 'Error while de-activating account',
      });
    }
  }

  @AUTH(AuthEnum.BEARER)
  @Delete()
  async delete(@ExtractAccountData('id') id: number) {
    this.logger.log('delete account attempted');

    try {
      const account = await this.accountService.findById(id);
      await this.accountService.delete(account);
      return 'Account deleted successfully';
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException({
        message: 'Error while deleting account',
      });
    }
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

    try {
      // in service, create an order and store it in the database for admin to review
      const order = await this.accountService.upgradeToInstructor(
        id,
        upgradeToInstructorDto,
      );
      // send a notification to the user that the request has been sent
      await this.email.sendOrderConfirmationEmail(email, order.id);
      return {
        message: 'Upgrade request sent successfully for review',
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException({
        message: 'Error while upgrading to instructor',
      });
    }
  }
}
