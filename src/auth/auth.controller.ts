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

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject() private readonly authService: AuthService) {}

  @Post('create-admin')
  async createAdmin(@Body() createAdminDto: any) {
    this.logger.log('create admin attempt');

    return { response: await this.authService.createAdmin(createAdminDto) };
  }

  @Post('sign-in')
  @AUTH(AuthEnum.NONE)
  async login(@Body() accountLoginDto: AccountLoginDto) {
    return { response: await this.authService.login(accountLoginDto) };
  }

  @Post('sign-up')
  @AUTH(AuthEnum.NONE)
  async signUp(@Body() accountSignupDto: AccountSignupDto) {
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

  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: AccountResetPasswordDto,
    @ExtractAccountData('id') id: number,
  ) {
    return {
      response: await this.authService.resetPassword(resetPasswordDto, id),
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
    return await this.authService.refreshToken(refreshToken);
  }

  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Get('test-token')
  async testToken() {
    return { response: 'valid token' };
  }
}
