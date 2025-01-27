import {
  BadRequestException,
  ConflictException, GoneException,
  Inject,
  Injectable,
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

// Entities
import { Account } from '../../account/entity/account.entity';

@Injectable()
export class AuthService {
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
    if(!account.isActive) throw new GoneException('Account is not active');
    if (
      !(await this.hashing.compare(accountLoginDto.password, account.password))
    )
      throw new NotFoundException('Invalid password');

    const { accessToken, refreshToken } =
      await this.tokenProvider.generateToken(account);
    return { accessToken, refreshToken };
  }

  async signup(accountSignupDto: AccountSignupDto): Promise<Account> {
    // account creation logic
    // 1. validate the request body with dto (email, password, role[default: user]) DONE
    // 2. check if the email is already registered DONE
    // 3. hash the password DONE
    // 4. create the account DONE
    // 5. create a profile and relate it to account (Not Implemented yet)
    // 6. create the access token and refresh token

    const { email, password, confirmPassword } = accountSignupDto;
    if (password !== confirmPassword)
      throw new BadRequestException('password does not match');

    if (await this.accountService.findByEmail(email))
      throw new ConflictException('Account already exists');

    return await this.accountService.signup(accountSignupDto);
  }

  async refreshToken(refresh_Token: RefreshTokenDto) {
    try {
      // verify refresh token
      const payload = await this.tokenProvider.verifyToken<
        Pick<AccountPayloadInterface, 'id'>
      >(refresh_Token.refreshToken, 'refresh');

      console.log(payload);

      // get an account by id
      const account = await this.accountService.findById(payload.id);

      // generate new access token

      const { accessToken } = await this.tokenProvider.generateToken(account);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }

  async verfiyToken(token: string, type: string) {
    return await this.tokenProvider.verifyToken(token, type);
  }
}
