import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Config } from './config.interface';

@Injectable()
export class ConfigService {
    constructor(private readonly configService: NestConfigService) { }

    get appConfig(): Config['app'] {
        return this.configService.get<Config['app']>('app');
    }

    get databaseConfig(): Config['database'] {
        return this.configService.get<Config['database']>('database');
    }

    get emailConfig(): Config['email'] {
        return this.configService.get<Config['email']>('email');
    }

    get googleConfig(): Config['google'] {
        return this.configService.get<Config['google']>('google');
    }

    get jwtConfig(): Config['jwt'] {
        return this.configService.get<Config['jwt']>('jwt');
    }

    get redisConfig(): Config['redis'] {
        return this.configService.get<Config['redis']>('redis');
    }

}