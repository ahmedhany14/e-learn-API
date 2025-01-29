import {
  BadRequestException,
  ConflictException,
  GoneException,
  Inject,
  Injectable, Logger,
  NotFoundException,
} from '@nestjs/common';

// Providers
import { TokenProvider } from '../providers/token.provider';
import { AccountService } from '../../account/service/account.service';
import { Hashing } from '../interfaces/Hashing';

// Dto and Interfaces
import { RefreshTokenDto } from '../dto/refresh_token.dto';
import { AccountLoginDto } from '../dto/account.login.dto';
import { AccountSignupDto } from '../dto/account.signup.dto';
import { AccountPayloadInterface } from '../interfaces/AccountPayload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject() private readonly tokenProvider: TokenProvider,
    @Inject() private readonly accountService: AccountService,
    @Inject() private readonly hashing: Hashing,
  ) {}

  async login(accountLoginDto: AccountLoginDto) {
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
    try {
      // verify refresh token
      const payload = await this.tokenProvider.verifyToken<
        Pick<AccountPayloadInterface, 'id'>
      >(refresh_Token.refreshToken, 'refresh');

      this.logger.log(`Payload: ${JSON.stringify(payload)}`);

      // get an account by id
      const account = await this.accountService.findById(payload.id);

      // generate new access token
      const { accessToken } = await this.tokenProvider.generateToken(account);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }
}
