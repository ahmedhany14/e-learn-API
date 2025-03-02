import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

// JWT and Crypto
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

// Database
import { Account } from '../../account/entity/account.entity';

// Interfaces
import { AccountPayloadInterface } from '../interfaces/AccountPayload.interface';

// Services
import { AccountRedisService } from 'src/redis/services/account.redis.service';
import { ConfigService } from 'src/configurations/config.service';

@Injectable()
export class TokenProvider {
  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    @Inject() private readonly accountRedisService: AccountRedisService,

    @Inject() private readonly configService: ConfigService,
  ) { }

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
        audience: this.configService.jwtConfig.tokenAudience,
        issuer: this.configService.jwtConfig.tokenIssuer,
        expiresIn: expiresIn,
      },
    );
  }

  public async generateToken(account: Account) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<AccountPayloadInterface>>(
        account.id,
        this.configService.jwtConfig.secret,
        this.configService.jwtConfig.expiresIn,
        {
          email: account.email,
          role: account.role,
        },
      ),
      this.signToken(
        account.id,
        this.configService.jwtConfig.refreshSecret,
        this.configService.jwtConfig.refreshExpiresIn,
        {},
      ),
    ]);
    return { accessToken, refreshToken };
  }

  public async generateResetToken(account: Account) {
    return await this.signToken<Partial<AccountPayloadInterface>>(
      account.id,
      this.configService.jwtConfig.reset_token_secret,
      this.configService.jwtConfig.reset_token_expires_in,
      {
        email: account.email,
      },
    );
  }

  public async verifyToken<T>(token: string, type: string) {
    let secret: string;
    if (type === 'reset') secret = this.configService.jwtConfig.reset_token_secret;
    else if (type === 'access') secret = this.configService.jwtConfig.secret;
    else secret = this.configService.jwtConfig.refreshSecret;
    try {
      return (await this.jwtService.verifyAsync(token, {
        secret,
        audience: this.configService.jwtConfig.tokenAudience,
        issuer: this.configService.jwtConfig.tokenIssuer,
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
      this.configService.redisConfig.active_token_expiration,
    );

    return {
      url,
      randomToken,
    };
  }
}
