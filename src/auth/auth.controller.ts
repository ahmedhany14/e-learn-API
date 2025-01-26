import { Controller, Post, Get, Inject, Body } from '@nestjs/common';

// services
import { AuthService } from './service/auth.service';

// dto
import { AccountLoginDto } from './dto/account.login.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() accountLoginDto: AccountLoginDto) {
    return await this.authService.login(accountLoginDto);
  }

  @Get('testToken')
  async testToken() {
    return 'Not implemented yet';
  }
}
