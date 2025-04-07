import { Inject, Injectable, Logger } from '@nestjs/common';

import { Redis } from 'ioredis';

// keys
import { resetPasswordToken } from '@app/constants';

@Injectable()
export class AuthRedisService {
    private readonly logger = new Logger(AuthRedisService.name);

    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    async setResetPasswordToken(token: string, id: number, expiresIn: number) {
        this.logger.log(
            `Setting reset password token for user ${id} with key ${resetPasswordToken(id)}`,
        );
        const key = resetPasswordToken(id);
        await this.redisClient.set(key, token, 'EX', expiresIn);
    }

    async getResetPasswordToken(id: number) {
        const key = resetPasswordToken(id);
        return this.redisClient.get(key);
    }

    async deleteResetPasswordToken(id: number) {
        const key = resetPasswordToken(id);
        return this.redisClient.del(key);
    }
}
