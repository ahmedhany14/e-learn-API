import {
  Controller,
  Post,
  Get,
  Inject,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';

// services
import { AuthService } from './service/auth.service';
import { TokenProvider } from './providers/token.provider';

// dto
import { AccountLoginDto } from './dto/account.login.dto';
import { AccountSignupDto } from './dto/account.signup.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';

// decorators and enums
import { AUTH } from './decorators/auth.decorator';
import { ROLE } from './decorators/role.decorator';
import { RoleEnum } from './enums/role.enum';
import { AuthEnum } from './enums/auth.enum';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly tokenProvider: TokenProvider,
  ) {}

  @Post('sign-in')
  @AUTH(AuthEnum.NONE)
  async login(@Body() accountLoginDto: AccountLoginDto) {
    console.log('accountLoginDto', accountLoginDto);
    return await this.authService.login(accountLoginDto);
  }

  @Post('sign-up')
  @AUTH(AuthEnum.NONE)
  async signUp(@Body() accountSignupDto: AccountSignupDto) {
    try {
      const account = await this.authService.signup(accountSignupDto);
      const { accessToken, refreshToken } =
        await this.tokenProvider.generateToken(account);
      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
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
