import { Inject, Injectable } from '@nestjs/common';

// JWT
import { JwtService } from '@nestjs/jwt';
import jwtConf from '../../common/config/jwt.cong';

// Configurations
import { ConfigType } from '@nestjs/config';

// Database
import { Account } from '../../account/entity/account.entity';

// Interfaces
import { AccountPayloadInterface } from '../interfaces/AccountPayload.interface';

@Injectable()
export class TokenProvider {
  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject(jwtConf.KEY)
    private readonly jwtConfigurations: ConfigType<typeof jwtConf>,
  ) {}

  private async signToken<T>(
    userId: number,
    secret: string,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      // 1. Payload
      {
        id: userId,
        ...payload,
      },
      // 2. Options
      {
        secret: secret,
        audience: this.jwtConfigurations.tokenAudience,
        issuer: this.jwtConfigurations.tokenIssuer,
        expiresIn: expiresIn,
      },
    );
  }

  public async generateToken(account: Account) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<AccountPayloadInterface>>(
        account.id,
        this.jwtConfigurations.secret,
        this.jwtConfigurations.expiresIn,
        {
          email: account.email,
        },
      ),
      this.signToken(
        account.id,
        this.jwtConfigurations.refreshSecret,
        this.jwtConfigurations.refreshExpiresIn,
        {},
      ),
    ]);
    return { accessToken, refreshToken };
  }

  public async verifyToken<T>(token: string, type: string) {
    const secret =
      type === 'access'
        ? this.jwtConfigurations.secret
        : this.jwtConfigurations.refreshSecret;

    return (await this.jwtService.verifyAsync(token, {
      secret,
      audience: this.jwtConfigurations.tokenAudience,
      issuer: this.jwtConfigurations.tokenIssuer,
    })) as T;
  }
}
