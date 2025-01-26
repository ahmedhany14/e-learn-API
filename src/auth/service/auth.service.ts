import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TokenProvider } from '../providers/token.provider';
import { AccountService } from '../../account/service/account.service';
import { AccountLoginDto } from '../dto/account.login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly tokenProvider: TokenProvider,
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly accountService: AccountService,
  ) {}

  async login(accountLoginDto: AccountLoginDto) {
    const account = await this.accountService.findByEmail(
      accountLoginDto.email,
    );
    if (!account) throw new NotFoundException('Account not found');

    if (account.password !== accountLoginDto.password)
      throw new NotFoundException('Invalid password');

    const { accessToken, refreshToken } =
      await this.tokenProvider.generateToken(account.id);
    return { accessToken, refreshToken };
  }

  async verfiyToken(token: string, type: string) {
    return await this.tokenProvider.verifyToken(token, type);
  }
}
