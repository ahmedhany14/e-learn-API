import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

// Modules
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from '../account/account.module';
import { ProfileModule } from '../profile/profile.module';
import { EmailModule } from '../common/email/email.module';
import { AppModule } from '../app.module';

// Services and Providers
import { TokenProvider } from './providers/token.provider';
import { AuthService } from './service/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { Hashing } from './interfaces/Hashing';
import { SignupProvider } from './providers/transactions/signup.provider';
import { AuthRedisService } from './service/auth.redis.service';

// JWT
import jwtCong from '../common/config/jwt.cong';
import { JwtModule } from '@nestjs/jwt';

// Redis
import redisCon from '../common/config/redis.conf';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entity/profile.entity';
import { Account } from '../account/entity/account.entity';
import { AccountRedisService } from '../account/service/account.redis.service';

@Module({
  imports: [
    // JWT
    ConfigModule.forFeature(jwtCong),
    JwtModule.registerAsync(jwtCong.asProvider()),
    // Redis
    ConfigModule.forFeature(redisCon),
    forwardRef(() => AccountModule),
    TypeOrmModule.forFeature([
      Account, Profile
    ]),
    ProfileModule,
    EmailModule,
    forwardRef(() => AppModule),
  ],

  controllers: [AuthController],

  providers: [
    TokenProvider,
    AuthService,
    {
      provide: Hashing,
      useClass: BcryptProvider,
    },
    SignupProvider,
    AuthRedisService,
    AccountRedisService
  ],

  exports: [AuthService, Hashing],
})
export class AuthModule {}
