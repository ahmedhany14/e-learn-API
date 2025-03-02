import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// App Modules

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';

// Guards
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access_token.guard';
import { PermissionGuard } from './auth/guards/permission.guard';

// providers and services
import { TokenProvider } from './auth/providers/token.provider';
import { Email } from './common/email/email';
import { MigrationService } from './db/migrations.service';
import { PlansViaAdminService } from './plans/service/plans.via.admin.service';

// Modules
import { ProfileModule } from './profile/profile.module';
import { EmailModule } from './common/email/email.module';
import { DbModule } from './db/db.module';
import { PlansModule } from './plans/plans.module';
import { AdminModule } from './admin/admin.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { InstructorModule } from './instructor/instructor.module';
import { PaginationModule } from './common/pagination/pagination.module';
import { CoursesModule } from './courses/courses.module';
import { FileModule } from './file/file.module';
import { TagsModule } from './tags/tags.module';
import { RedisModule } from './redis/redis.module';
import { ConfigService } from './configurations/config.service';
import { ConfigurationsModule } from './configurations/configurations.module';
import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './orders/orders.module';

// Interceptors
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// Middleware
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RateLimiterMiddleware } from './common/middleware/rate.limiter.middleware';


@Module({
  imports: [
    // ORM and Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationsModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.databaseConfig.host,
        port: configService.databaseConfig.port,
        username: configService.databaseConfig.username,
        password: configService.databaseConfig.password,
        database: configService.databaseConfig.database,
        synchronize: configService.databaseConfig.synchronize,
        autoLoadEntities: configService.databaseConfig.autoLoadEntities,
        namingStrategy: new SnakeNamingStrategy(),
        logger: 'advanced-console', // Use the advanced console logger
        logging: ['query'], // Log the query
      }),
    }),

    AuthModule,

    AccountModule,

    ProfileModule,

    EmailModule,

    AdminModule,

    InstructorModule,

    PaginationModule,

    CoursesModule,

    FileModule,

    TagsModule,

    PlansModule,

    RedisModule,

    ConfigurationsModule,

    JwtModule,

    OrdersModule
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

    PlansViaAdminService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, RateLimiterMiddleware).forRoutes('*');
    //consumer.apply(LoggerMiddleware).forRoutes('auth'); // for specific route
  }
}
