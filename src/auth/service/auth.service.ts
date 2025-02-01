import {
  BadRequestException,
  ConflictException,
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

// Providers and Services
import { TokenProvider } from '../providers/token.provider';
import { AccountService } from '../../account/service/account.service';
import { Hashing } from '../interfaces/Hashing';
import { SignupProvider } from '../providers/transactions/signup.provider';
import { Email } from '../../common/email/email';
import { AuthRedisService } from './auth.redis.service';
import { ConfigService } from '@nestjs/config';

// Dto and Interfaces
import { RefreshTokenDto } from '../dto/refresh_token.dto';
import { AccountLoginDto } from '../dto/account.login.dto';
import { AccountSignupDto } from '../dto/account.signup.dto';
import { AccountPayloadInterface } from '../interfaces/AccountPayload.interface';
import { ResetPasswordDto } from '../dto/reset.password.dto';
import { AccountResetPasswordDto } from '../dto/account.reset-password.dto';
import { ForgetDto } from '../dto/forget.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject() private readonly tokenProvider: TokenProvider,
    @Inject() private readonly accountService: AccountService,
    @Inject() private readonly hashing: Hashing,
    @Inject() private readonly email: Email,
    @Inject() private readonly redisService: AuthRedisService,
    @Inject() private readonly configService: ConfigService,
    @Inject() private readonly signupProvider: SignupProvider,
  ) {}

  async createAdmin(admin: any) {
    admin.password = await this.hashing.hash(admin.password);
    return await this.accountService.createAdmin(admin);
  }

  async signUp(accountSignupDto: AccountSignupDto) {
    this.logger.log('sign up attempt');
    try {
      const { account, profile } =
        await this.signupProvider.signup(accountSignupDto);
      const { accessToken, refreshToken } =
        await this.tokenProvider.generateToken(account);

      //await this.email.sendWelcomeEmail(account.email, profile, accessToken);

      return { accessToken, refreshToken };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async login(accountLoginDto: AccountLoginDto) {
    this.logger.log('login attempt');

    const account = await this.accountService.findByEmail(
      accountLoginDto.email,
    );
    if (!account) throw new NotFoundException('Account not found');
    if (!account.isActive) throw new GoneException('Account is not active');
    if (
      !(await this.hashing.compare(accountLoginDto.password, account.password))
    )
      throw new NotFoundException('Invalid password');

    const { accessToken, refreshToken } =
      await this.tokenProvider.generateToken(account);
    return { accessToken, refreshToken };
  }

  async refreshToken(refresh_Token: RefreshTokenDto) {
    this.logger.log('refresh token attempt');
    try {
      const payload = await this.tokenProvider.verifyToken<
        Pick<AccountPayloadInterface, 'id'>
      >(refresh_Token.refreshToken, 'refresh');

      this.logger.log(`Payload: ${JSON.stringify(payload)}`);

      const account = await this.accountService.findById(payload.id);

      const { accessToken } = await this.tokenProvider.generateToken(account);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }

  async resetPassword(resetPasswordDto: AccountResetPasswordDto, id: number) {
    this.logger.log('Reset password attempt');

    try {
      const account = await this.accountService.findById(id);

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
        ))
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
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred',
        details: err.message,
      });
    }
  }

  async forgotPassword(forgetDto: ForgetDto) {
    this.logger.log(`Forgot password attempt for ${forgetDto.email}`);
    const account = await this.accountService.findByEmail(forgetDto.email);
    if (!account) {
      throw new NotFoundException({
        message: 'Forget password failed',
        details: 'no account found with this email',
      });
    }
    const reset_token = await this.tokenProvider.generateResetToken(account);

    await this.redisService.setResetPasswordToken(
      reset_token,
      account.id,
      this.configService.get<number>('jwt.reset_token_expires_in'),
    );

    this.logger.log(
      `"http://localhost:3000/auth/reset-password/${reset_token}`,
    ); // 3ashan 5adt baaaan in sendmail
    //await this.email.sendResetPasswordEmail(account.email, reset_token);
  }

  async resetPasswordWithToken(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    this.logger.log('Reset password attempt');

    const payload = await this.tokenProvider.verifyToken<
      Pick<AccountPayloadInterface, 'id'>
    >(token, 'reset');

    if (token !== (await this.redisService.getResetPasswordToken(payload.id))) {
      throw new BadRequestException({
        message: 'reset password failed',
        details: 'Invalid token or token expired',
      });
    }

    const account = await this.accountService.findById(payload.id);

    await this.accountService.updatePassword(
      account,
      await this.hashing.hash(resetPasswordDto.password),
    );

    const { accessToken, refreshToken } =
      await this.tokenProvider.generateToken(account);

    await this.redisService.deleteResetPasswordToken(payload.id); // remove token from redis
    return { accessToken, refreshToken };
  }
}
