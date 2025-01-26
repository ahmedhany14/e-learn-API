import { Controller, Post, Get, Inject, Body } from '@nestjs/common';

// services
import { AuthService } from './service/auth.service';

// dto
import { AccountLoginDto } from './dto/account.login.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';

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

  @Post('refreshToken')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }
}
