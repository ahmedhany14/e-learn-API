import { Controller, Post, Body, Inject, Get } from '@nestjs/common';

// dto
import { CreateAccountDto } from './dtos/create-account.dto';

// service
import { AccountService } from './service/account.service';

@Controller('account')
export class AccountController {
  constructor(@Inject() private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    console.log('createAccountDto', createAccountDto);
    return await this.accountService.create(createAccountDto);
  }

  @Get()
  async findByEmail(@Body('email') email: string) {
    return await this.accountService.findByEmail(email);
  }
}
