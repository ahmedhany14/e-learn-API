import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
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
import { Email } from '@app/email';
import { MigrationService } from './db/migrations.service';
import { PlansViaAdminService } from './plans/service/plans.via.admin.service';

// Modules
import { ProfileModule } from './profile/profile.module';
import { EmailModule } from '@app/email';
import { DbModule } from './db/db.module';
import { PlansModule } from './plans/plans.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { InstructorModule } from './instructor/instructor.module';
import { CoursesModule } from './courses/courses.module';
import { FileModule } from './file/file.module';
import { TagsModule } from './tags/tags.module';
import { RedisModule } from './redis/redis.module';
import { ConfigService } from '@app/configurations';
import { ConfigurationsModule } from '@app/configurations';
import { JwtModule } from '@nestjs/jwt';
import { BlogModule } from './blog-system/blog/blog.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from './blog-system/comments/comments.module';
import { RepliesModule } from './blog-system/replies/replies.module';
import { VideosModule } from './videos/videos.module';
import { SectionsModule } from './sections/sections.module';
import { ReviewCoursesModule } from './administration/review-courses/review-courses.module';
import { AdministrationModule } from './administration/administration.module';
import { PaymentsModule } from './payments/payments.module';
import { VideoNotesModule } from './videos-engagement-and-interaction/notes/notes.module';
import { VideoCommentsModule } from './videos-engagement-and-interaction/comments/comments.module';

// Interceptors
import { ResponseInterceptor } from '@app/interceptors';
import { HttpExceptionFilter } from '@app/interceptors';

// Middleware
import { LoggerMiddleware } from '@app/middlewares';
import { RateLimiterMiddleware } from '@app/middlewares';
import { SearchModule } from './search/search.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
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
            }),
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigurationsModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.databaseConfig.url,
            }),
        }),

        AuthModule,

        AccountModule,

        ProfileModule,

        EmailModule,

        InstructorModule,

        CoursesModule,

        FileModule,

        TagsModule,

        PlansModule,

        RedisModule,

        ConfigurationsModule,

        JwtModule,

        BlogModule,

        CommentsModule,

        RepliesModule,

        VideosModule,

        SectionsModule,

        ReviewCoursesModule,

        AdministrationModule,

        PaymentsModule,

        VideoCommentsModule,

        VideoNotesModule,

        SearchModule,

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
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware, RateLimiterMiddleware).forRoutes('*');
        //consumer.apply(LoggerMiddleware).forRoutes('auth'); // for specific route
    }
}
