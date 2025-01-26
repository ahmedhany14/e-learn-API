import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

// Modules
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from '../account/account.module';

// Services and Providers
import { TokenProvider } from './providers/token.provider';
import { AuthService } from './service/auth.service';
import { BcryptProvider } from './providers/bcrypt.provider';
import { Hashing } from './interfaces/Hashing';

// JWT
import jwtCong from '../common/config/jwt.cong';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // JWT
    ConfigModule.forFeature(jwtCong),
    JwtModule.registerAsync(jwtCong.asProvider()),
    forwardRef(() => AccountModule),
  ],

  controllers: [AuthController],

  providers: [
    TokenProvider,
    AuthService,
    {
      provide: Hashing,
      useClass: BcryptProvider,
    },
  ],

  exports: [AuthService, Hashing],
})
export class AuthModule {}
