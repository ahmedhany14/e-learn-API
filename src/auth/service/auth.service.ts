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
import { AccountEnum } from '../../account/entity/account.enum';

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

  async signUp(accountSignupDto: AccountSignupDto) {
    this.logger.log('sign up attempt');
    const { account } = await this.signupProvider.signup(accountSignupDto);
    const { accessToken, refreshToken } =
      await this.tokenProvider.generateToken(account);

    await this.email.sendWelcomeEmail(account.email, accessToken);

    return { accessToken, refreshToken };
  }

  async login(accountLoginDto: AccountLoginDto) {
    this.logger.log('login attempt');

    const select = [
      AccountEnum.ID,
      AccountEnum.EMAIL,
      AccountEnum.PASSWORD,
      AccountEnum.IS_ACTIVE,
    ];

    const account = await this.accountService.findByEmail(
      accountLoginDto.email,
      select,
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
    const payload = await this.tokenProvider.verifyToken<
      Pick<AccountPayloadInterface, 'id'>
    >(refresh_Token.refreshToken, 'refresh');

    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    const select = [AccountEnum.ID, AccountEnum.EMAIL, AccountEnum.ROLE];

    const account = await this.accountService.findById(payload.id, select);

    if (!account || account.isActive === false) {
      throw new NotFoundException({
        message: 'Account not found or account is not active',
      });
    }
    const { accessToken } = await this.tokenProvider.generateToken(account);
    return { accessToken };
  }

  async resetPassword(resetPasswordDto: AccountResetPasswordDto, id: number) {
    this.logger.log('Reset password attempt');

    const select = [
      AccountEnum.ID,
      AccountEnum.PASSWORD,
      AccountEnum.IS_ACTIVE,
    ];

    const account = await this.accountService.findById(id, select);

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

    console.log(account.password, resetPasswordDto.oldPassword);

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
  }

  async forgotPassword(forgetDto: ForgetDto) {
    this.logger.log(`Forgot password attempt for ${forgetDto.email}`);

    const select = [AccountEnum.ID, AccountEnum.EMAIL];

    const account = await this.accountService.findByEmail(
      forgetDto.email,
      select,
    );
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
    );
    await this.email.sendResetPasswordEmail(account.email, reset_token);
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

    const select = [AccountEnum.ID, AccountEnum.PASSWORD];
    const account = await this.accountService.findById(payload.id, select);

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
