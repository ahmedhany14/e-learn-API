import {
  Body,
  Controller,
  Delete,
  Get,
  GoneException,
  Inject, Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';

// dto
import { CreateAccountDto } from './dtos/create-account.dto';

// service
import { AccountService } from './service/account.service';

// decorators
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(@Inject() private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    this.logger.log('createAccountDto', createAccountDto);
    return await this.accountService.create(createAccountDto);
  }

  @Get()
  async findByEmail(@Body('email') email: string) {
    return await this.accountService.findByEmail(email);
  }

  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Delete('deactive-account')
  async deActive(@ExtractAccountData('id') id: number) {
    try {
      const account = await this.accountService.findById(id);
      await this.accountService.flipActiveState(account);
      return 'Account de-activated successfully';
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @AUTH(AuthEnum.BEARER)
  @Delete()
  async delete(@ExtractAccountData('id') id: number) {
    try {
      const account = await this.accountService.findById(id);
      await this.accountService.delete(account);
      return 'Account deleted successfully';
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
