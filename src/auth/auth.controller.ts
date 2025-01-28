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
} from '@nestjs/common';

// services and providers
import { AuthService } from './service/auth.service';
import { TokenProvider } from './providers/token.provider';
import { AccountService } from '../account/service/account.service';
import { Hashing } from './interfaces/Hashing';
import { SignupProvider } from './providers/transactions/signup.provider';

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
  constructor(
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly tokenProvider: TokenProvider,
    @Inject() private readonly accountService: AccountService,
    @Inject() private readonly hashing: Hashing,
    @Inject() private readonly signupProvider: SignupProvider,
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
      if (accountSignupDto.password !== accountSignupDto.confirmPassword)
        throw new BadRequestException('password does not match');
      const accountDate: CreateAccountInterface = {
        email: accountSignupDto.email,
        password: accountSignupDto.password,
      };

      const profileDate: CreateProfileInterface = {
        firstName: accountSignupDto.firstName,
        lastName: accountSignupDto.lastName,
        bio: accountSignupDto.bio,
        phone_number: accountSignupDto.phone_number,
      };

      const { account, profile } = await this.signupProvider.signup(
        accountDate,
        profileDate,
      );

      const { accessToken, refreshToken } =
        await this.tokenProvider.generateToken(account);
      return { accessToken, refreshToken };
    } catch (err) {
      console.log(err);
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
  @Post('forget-password')
  async forgotPassword(
    @Body() resetPasswordDto: AccountResetPasswordDto,
    @ExtractAccountData('id') id: number,
  ) {
    try {
      const account = await this.accountService.findById(id);
      console.log(account);
      if (!account) throw new NotFoundException('Account not found');
      if (!account.isActive) throw new GoneException('Account is not active');
      if (
        !(await this.hashing.compare(
          resetPasswordDto.oldPassword,
          account.password,
        )) ||
        resetPasswordDto.confirmPassword !== resetPasswordDto.newPassword
      )
        throw new BadRequestException('Invalid password');

      /*
      1. check if an account is active and registered DONE
      2. I need an old password and check if it is correctly DONE
      3. I need new password and confirm new password
      4. hash the new password
      5. update the account data with the new password
      6. create a new access token and refresh token
      7. force old access token and refresh token to expire [Not Implemented yet]
       */

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
      console.log(err);
      throw err;
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
