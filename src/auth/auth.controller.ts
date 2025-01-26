import { Controller, Post, Get, Inject, Body } from '@nestjs/common';

// services
import { AuthService } from './service/auth.service';

// dto
import { AccountLoginDto } from './dto/account.login.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';

// decorators and enums
import { AUTH } from './decorators/auth.decorator';
import { AuthEnum } from './enums/auth.enum';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('login')
  @AUTH(AuthEnum.NONE)
  async login(@Body() accountLoginDto: AccountLoginDto) {
    return await this.authService.login(accountLoginDto);
  }

  @Post('refreshToken')
  @AUTH(AuthEnum.NONE)
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Get('test-token')
  @AUTH(AuthEnum.BEARER)
  async testToken() {
    return 'valid token';
  }
}
