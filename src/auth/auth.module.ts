import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

// Modules
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from '../account/account.module';
import { ProfileModule } from '../profile/profile.module';
import { EmailModule } from '../common/email/email.module';
import { AppModule } from '../app.module';
import { ConfigurationsModule } from '../configurations/configurations.module';

// Services and Providers
import { TokenProvider } from './providers/token.provider';
import { AuthService } from './service/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { Hashing } from './interfaces/Hashing';
import { SignupProvider } from './providers/transactions/signup.provider';
import { AccountRedisService } from '../redis/services/account.redis.service';
import { GoogleService } from './strategies/google.service';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entity/profile.entity';
import { Account } from '../account/entity/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Profile]),
    forwardRef(() => AccountModule),
    forwardRef(() => AppModule),
    JwtModule,
    ConfigurationsModule,
    ProfileModule,
    EmailModule,
    RedisModule
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
    AccountRedisService,
    GoogleService,
  ],

  exports: [AuthService, Hashing, TokenProvider],
})
export class AuthModule { }
