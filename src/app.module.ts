import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// App Modules
import { AuthModule } from './auth/auth.module';

// Configurations for the application
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './common/config/app.conf';
import databaseConf from './common/config/database.conf';
import jwtCong from './common/config/jwt.cong';
import emialConf from './common/config/emial.conf';
import envValidation from './common/config/validations.conf';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';

// JWT
import { JwtModule } from '@nestjs/jwt';

// Guards
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access_token.guard';
import { PermissionGuard } from './auth/guards/permission.guard';

// providers and services
import { TokenProvider } from './auth/providers/token.provider';
import { Email } from './common/email/email';

// Modules
import { ProfileModule } from './profile/profile.module';
import { EmailModule } from './common/email/email.module';

const env = process.env.NODE_ENV;

@Module({
  imports: [
    // Configurations Parameters and Validation
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${env}.env`,
      load: [appConfig, databaseConf, emialConf],
      validationSchema: envValidation,
    }),

    // JWT
    ConfigModule.forFeature(jwtCong),
    JwtModule.registerAsync(jwtCong.asProvider()),

    // ORM and Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
      }),
    }),

    AuthModule,

    AccountModule,

    ProfileModule,

    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    AccessTokenGuard,
    TokenProvider,
    Email,
  ],
})
export class AppModule {}
