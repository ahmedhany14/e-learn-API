import {
  Controller,
  Post,
  Get,
  Inject,
  Body,
  InternalServerErrorException,
  NotFoundException,
  GoneException,
  BadRequestException, Logger,
} from '@nestjs/common';

// services and providers
import { AuthService } from './service/auth.service';
import { TokenProvider } from './providers/token.provider';
import { AccountService } from '../account/service/account.service';
import { Hashing } from './interfaces/Hashing';
import { SignupProvider } from './providers/transactions/signup.provider';
import { Email } from '../common/email/email';

// dto and interfaces
import { AccountLoginDto } from './dto/account.login.dto';
import { AccountSignupDto } from './dto/account.signup.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { AccountResetPasswordDto } from './dto/account.reset-password.dto';
import { CreateAccountInterface } from '../account/interfaces/create.account.interface';
import { CreateProfileInterface } from '../profile/interfaces/create.profile.interface';

// decorators and enums
import { AUTH } from './decorators/auth.decorator';
import { ROLE } from './decorators/role.decorator';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { RoleEnum } from './enums/role.enum';
import { AuthEnum } from './enums/auth.enum';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly tokenProvider: TokenProvider,
    @Inject() private readonly accountService: AccountService,
    @Inject() private readonly hashing: Hashing,
    @Inject() private readonly signupProvider: SignupProvider,
    @Inject() private readonly email: Email,
  ) {
  }

  @Post('sign-in')
  @AUTH(AuthEnum.NONE)
  async login(@Body() accountLoginDto: AccountLoginDto) {
    this.logger.log('Login attempt with email: ' + accountLoginDto.email);
    return await this.authService.login(accountLoginDto);
  }

  @Post('sign-up')
  @AUTH(AuthEnum.NONE)
  async signUp(@Body() accountSignupDto: AccountSignupDto) {
    try {
      if (accountSignupDto.password !== accountSignupDto.confirmPassword)
        throw new BadRequestException({
          message: 'Passwords do not match',
          details: 'Password and confirm password must be the same',
        });

      const { account, profile } = await this.signupProvider.signup(
        accountSignupDto
      );
      const { accessToken, refreshToken } =
        await this.tokenProvider.generateToken(account);

      //await this.email.sendWelcomeEmail(account.email, profile, accessToken);

      return { accessToken, refreshToken };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Post('sign-out')
  async signOut() {
    /*
    Not implemented yet
     */

    return 'Sign out';
  }

  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Post('reset-password')
  async forgotPassword(
    @Body() resetPasswordDto: AccountResetPasswordDto,
    @ExtractAccountData('id') id: number,
  ) {
    try {
      const account = await this.accountService.findById(id);
      this.logger.log('Forget password attempt with email: ' + account.email);

      if (!account) {
        throw new NotFoundException({
          message: 'reset password failed',
          details: 'Account with provided id not found',
        });
      }

      if (!account.isActive) {
        throw new GoneException({
          message: 'reset password failed',
          details: 'Account is not active',
        });
      }

      if (
        !(await this.hashing.compare(
          resetPasswordDto.oldPassword,
          account.password,
        )) ||
        resetPasswordDto.confirmPassword !== resetPasswordDto.newPassword
      )
        throw new BadRequestException({
          message: 'reset password failed',
          details: 'Old password is incorrect or new passwords do not match',
        });

      const newAccount = await this.accountService.updatePassword(
        account,
        await this.hashing.hash(resetPasswordDto.newPassword),
      );

      const { accessToken, refreshToken } =
        await this.tokenProvider.generateToken(newAccount);

      newAccount.password = undefined;

      return {
        newAccount,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @AUTH(AuthEnum.NONE)
  @Post('refreshToken')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    this.logger.log('Refresh token attempt');
    return await this.authService.refreshToken(refreshToken);
  }

  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Get('test-token')
  async testToken() {
    return 'valid token';
  }
}