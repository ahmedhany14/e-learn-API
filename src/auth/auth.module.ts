import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

// Modules
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from '../account/account.module';
import { ProfileModule } from '../profile/profile.module';

// Services and Providers
import { TokenProvider } from './providers/token.provider';
import { AuthService } from './service/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { Hashing } from './interfaces/Hashing';
import { SignupProvider } from './providers/transactions/signup.provider';

// JWT
import jwtCong from '../common/config/jwt.cong';
import { JwtModule } from '@nestjs/jwt';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entity/profile.entity';
import { Account } from '../account/entity/account.entity';

@Module({
  imports: [
    // JWT
    ConfigModule.forFeature(jwtCong),
    JwtModule.registerAsync(jwtCong.asProvider()),
    forwardRef(() => AccountModule),
    TypeOrmModule.forFeature([
      Account, Profile
    ]),
    ProfileModule,
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
  ],

  exports: [AuthService, Hashing],
})
export class AuthModule {}
