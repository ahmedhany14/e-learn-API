import {
  Controller,
  Post,
  Get,
  Inject,
  Body,
  InternalServerErrorException,
  NotFoundException,
  GoneException,
  BadRequestException,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';

// services and providers
import { AuthService } from './service/auth.service';

// dto and interfaces
import { AccountLoginDto } from './dto/account.login.dto';
import { AccountSignupDto } from './dto/account.signup.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { AccountResetPasswordDto } from './dto/account.reset-password.dto';
import { ForgetDto } from './dto/forget.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

// decorators and enums
import { AUTH } from './decorators/auth.decorator';
import { ROLE } from './decorators/role.decorator';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { RoleEnum } from './enums/role.enum';
import { AuthEnum } from './enums/auth.enum';
import { AccountEnum } from '../account/entity/account.enum';
import { ACCOUNT_SELECT } from '../account/decorators/account.select.decorator';

// interfaces
import { SafeResetAccountPassword } from '../account/interfaces/accounts.interface';
import { ExtractAccountInterceptor } from '../account/interceptors/extract.account.interceptor';

@UseInterceptors(ExtractAccountInterceptor)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('sign-in')
  @AUTH(AuthEnum.NONE)
  async login(@Body() accountLoginDto: AccountLoginDto) {
    this.logger.log('login attempt');

    return { response: await this.authService.login(accountLoginDto) };
  }

  @Post('sign-up')
  @AUTH(AuthEnum.NONE)
  async signUp(@Body() accountSignupDto: AccountSignupDto) {
    this.logger.log('sign up attempt');

    return { response: await this.authService.signUp(accountSignupDto) };
  }

  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Post('sign-out')
  async signOut() {
    /*
    Not implemented yet
     */

    return { response: 'Sign out' };
  }

  @ACCOUNT_SELECT(AccountEnum.ID, AccountEnum.PASSWORD, AccountEnum.IS_ACTIVE)
  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: AccountResetPasswordDto,
    @ExtractAccountData() account: SafeResetAccountPassword,
  ) {
    this.logger.log('reset password attempt');
    console.log(account);
    return {
      response: await this.authService.resetPassword(resetPasswordDto, account),
    };
  }

  @Post('forgot-password')
  @AUTH(AuthEnum.NONE)
  async forgotPassword(@Body() forgetDto: ForgetDto) {
    await this.authService.forgotPassword(forgetDto);
    return { response: 'email sent' };
  }

  @Post('reset-password/:token')
  @AUTH(AuthEnum.NONE)
  async resetPasswordWithToken(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    this.logger.log('reset password with token attempt');

    return {
      response: await this.authService.resetPasswordWithToken(
        token,
        resetPasswordDto,
      ),
    };
  }

  @AUTH(AuthEnum.NONE)
  @Post('refreshToken')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    this.logger.log('refresh token attempt');

    return {
      response: await this.authService.refreshToken(refreshToken),
    };
  }

  @AUTH(AuthEnum.BEARER)
  @Get('test-token')
  async testToken() {
    return { response: 'valid token' };
  }
}
