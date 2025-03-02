import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

// keys
import { activeToken } from '../../common/constants/redis.keys.constants';
import * as console from 'node:console';

@Injectable()
export class AccountRedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async hashActiveToken(token: string, id: number, expiresIn: number) {
    /*
      strategy:
          with key active-token:id
          hash {
            token: token,
            id: id,
          }
          expire in expiresIn
     */
    const key = activeToken(id);

    await this.redisClient.hset(key, {
      token: token,
      id: id,
    });
    console.log('hash created', expiresIn);
    await this.redisClient.expire(key, expiresIn);
  }

  async getActiveToken(id: number) {
    const key = activeToken(id);
    const data = (await this.redisClient.hgetall(key)) as {
      token: string;
      id: string;
    };
    console.log(key);
    await this.redisClient.del(key);
    return data;
  }
}
