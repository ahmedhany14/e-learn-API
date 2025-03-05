import { Module } from '@nestjs/common';
import { ConfigService } from 'src/configurations/config.service';
import Redis from 'ioredis';
import { ConfigurationsModule } from 'src/configurations/configurations.module';
import { AuthRedisService } from './services/auth.redis.service';
import { AccountRedisService } from './services/account.redis.service';
import { BlogRedisCachingService } from './services/blog.redis.caching.service';
import { CommentRedisCachingService } from './services/comment.redis.caching.service';

@Module({
  imports: [ConfigurationsModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.redisConfig.host,
          port: configService.redisConfig.port,
          password: configService.redisConfig.password,
        });
      },
    },
    AuthRedisService,
    AccountRedisService,
    BlogRedisCachingService,
    CommentRedisCachingService,
  ],

  exports: [
    'REDIS_CLIENT',
    AuthRedisService,
    AccountRedisService,
    BlogRedisCachingService,
    CommentRedisCachingService,
  ],
})
export class RedisModule {}
