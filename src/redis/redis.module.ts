import { Module } from '@nestjs/common';
import { ConfigService } from 'src/configurations/config.service';
import Redis from 'ioredis';
import { ConfigurationsModule } from 'src/configurations/configurations.module';
import { AuthRedisService } from './services/auth.redis.service';
import { AccountRedisService } from './services/account.redis.service';

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
        AccountRedisService
    ],

    exports: ['REDIS_CLIENT', AuthRedisService, AccountRedisService],

})
export class RedisModule { }
