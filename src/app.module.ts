import { MiddlewareConsumer, Module } from '@nestjs/common';
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

// JWT
import { JwtModule } from '@nestjs/jwt';

// Guards
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access_token.guard';
import { PermissionGuard } from './auth/guards/permission.guard';

// providers and services
import { TokenProvider } from './auth/providers/token.provider';
import { Email } from './common/email/email';
import { MigrationService } from './db/migrations.service';

// Modules
import { ProfileModule } from './profile/profile.module';
import { EmailModule } from './common/email/email.module';
import { DbModule } from './db/db.module';
import { AdminModule } from './admin/admin.module';
import { AccountModule } from './account/account.module';

// Interceptors
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Middleware
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RateLimiterMiddleware } from './common/middleware/rate.limiter.middleware';

// Redis
import Redis from 'ioredis';

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
        logger: 'advanced-console', // Use the advanced console logger
        // For even more detailed logging:
        logging: ['query'],
      }),
    }),

    AuthModule,

    AccountModule,

    ProfileModule,

    EmailModule,

    AdminModule,

    // DbModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AccessTokenGuard,
    TokenProvider,
    Email,
    // MigrationService,

    // Guards
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },

    // Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // redis
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        });
      },
    },
  ],

  exports: ['REDIS_CLIENT'],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, RateLimiterMiddleware).forRoutes('*');
    //consumer.apply(LoggerMiddleware).forRoutes('auth'); // for specific route
  }
}
