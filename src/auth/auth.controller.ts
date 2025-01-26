import { Controller, Post, Get, Inject, Body } from '@nestjs/common';

// services
import { AuthService } from './service/auth.service';

// dto
import { AccountLoginDto } from './dto/account.login.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';

// decorators and enums
import { AUTH } from './decorators/auth.decorator';
import { ROLE} from './decorators/role.decorator';
import { RoleEnum } from './enums/role.enum';
import { AuthEnum } from './enums/auth.enum';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('login')
  @AUTH(AuthEnum.NONE)
  async login(@Body() accountLoginDto: AccountLoginDto) {
    console.log('accountLoginDto', accountLoginDto);
    return await this.authService.login(accountLoginDto);
  }

  @AUTH(AuthEnum.NONE)
  @Post('refreshToken')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }

  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Get('test-token')
  async testToken() {
    return 'valid token';
  }
}
