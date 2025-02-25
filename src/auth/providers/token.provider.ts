import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

// JWT and Crypto
import { JwtService } from '@nestjs/jwt';
import jwtConf from '../../common/config/jwt.cong';
import * as crypto from 'crypto';

// Configurations
import { ConfigType } from '@nestjs/config';
import redisCon from './../../common/config/redis.conf';

// Database
import { Account } from '../../account/entity/account.entity';

// Interfaces
import { AccountPayloadInterface } from '../interfaces/AccountPayload.interface';

// Services
import { AccountRedisService } from 'src/account/service/account.redis.service';

@Injectable()
export class TokenProvider {
  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject(jwtConf.KEY)
    private readonly jwtConfigurations: ConfigType<typeof jwtConf>,
    @Inject(redisCon.KEY)
    private readonly redisConfigurations: ConfigType<typeof redisCon>,
    @Inject() private readonly accountRedisService: AccountRedisService,
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
          role: account.role,
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

  public async generateResetToken(account: Account) {
    return await this.signToken<Partial<AccountPayloadInterface>>(
      account.id,
      this.jwtConfigurations.reset_token_secret,
      this.jwtConfigurations.reset_token_expires_in,
      {
        email: account.email,
      },
    );
  }

  public async verifyToken<T>(token: string, type: string) {
    let secret: string;
    if (type === 'reset') secret = this.jwtConfigurations.reset_token_secret;
    else if (type === 'access') secret = this.jwtConfigurations.secret;
    else secret = this.jwtConfigurations.refreshSecret;
    try {
      return (await this.jwtService.verifyAsync(token, {
        secret,
        audience: this.jwtConfigurations.tokenAudience,
        issuer: this.jwtConfigurations.tokenIssuer,
      })) as T;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Invalid token',
        details: e.message,
      });
    }
  }

  async generate_active_token(account_id: number) {
    const randomToken = crypto.randomBytes(8).toString('hex');
    const url =
      'http://localhost:3000/account/active-account/' +
      account_id +
      '/' +
      randomToken;

    await this.accountRedisService.hashActiveToken(
      randomToken,
      account_id,
      this.redisConfigurations.active_token_expiration,
    );

    return {
      url,
      randomToken,
    };
  }
}
