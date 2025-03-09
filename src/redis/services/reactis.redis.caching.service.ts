import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import {
    LIKES_KEY,
    DISLIKES_KEY,
} from '../../common/constants/redis-keys/blogs.keys';

import { types } from '../../common//enums/react.to.types';

@Injectable()
export class ReactisRedisCachingService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    ) { }


    async setLike(
        type: types,
        id: string,
        liker_id: number
    ) {
        /*
        Strategy:
        * i will use a set to store the likes of a comment, blog or reply
        * i will use the comment id as the key  (comment:likes:${comment_id})
        * i will store in each key the id of the author who liked the comment
        * to avoid conflicts, i will check if the author id is already in the set (SISMEMBER)
        * if the author id is not in the set, i will add the author id to the set (SADD)
        * if the author id is already in the set, i will remove the author id from the set (SREM)
        * another check: if the user is in the dislikes set, i will remove the user from the dislikes set
        * what will return:
            1) if the user is in the dislikes set, i will return { like: 1, dislike: -1 }, to indicate that the dislike was removed and the like was added
            2) if the user is in the likes set, i will return { like: -1, dislike: 0 }, to indicate that the like was removed
            3) if the user is not in the likes set, i will return { like: 1, dislike: 0 }, to indicate that the like was
        */

        const dislike_key = DISLIKES_KEY(type, id);
        const like_key = LIKES_KEY(type, id);

        const is_disliker = await this.redisClient.sismember(dislike_key, liker_id);

        if (is_disliker) {
            await this.redisClient.srem(dislike_key, liker_id);
            await this.redisClient.sadd(like_key, liker_id);
            return { like: 1, dislike: -1 };
        }

        const is_liker = await this.redisClient.sismember(like_key, liker_id);

        if (is_liker) {
            await this.redisClient.srem(like_key, liker_id);
            return { like: -1, dislike: 0 };
        }
        else {
            await this.redisClient.sadd(like_key, liker_id);
            return { like: 1, dislike: 0 };
        }
    }

    async setDislike(
        type: types,
        id: string,
        disliker_id: number
    ) {
        /*
        Strategy:
        * i will use a set to store the dislikes of a comment
        * i will use the comment id as the key  (comment:dislikes:${comment_id})
        * i will store in each key the id of the author who disliked the comment
        * to avoid conflicts, i will check if the author id is already in the set (SISMEMBER)
        * if the author id is not in the set, i will add the author id to the set (SADD)
        * if the author id is already in the set, i will remove the author id from the set (SREM)
        * another check: if the user is in the likes set, i will remove the user from the likes set
        * what will return:
            1) if the user is in the likes set, i will return { like: -1, dislike: 1 }, to indicate that the like was removed and the dislike was added
            2) if the user is in the dislikes set, i will return { like: 0, dislike: -1 }, to indicate that the dislike was removed
            3) if the user is not in the dislikes set, i will return { like: 0, dislike: 1 }, to indicate that the dislike was added
        */

        const like_key = LIKES_KEY(type, id);
        const dislike_key = DISLIKES_KEY(type, id);

        const is_liker = await this.redisClient.sismember(like_key, disliker_id);

        if (is_liker) {
            await this.redisClient.srem(like_key, disliker_id);
            await this.redisClient.sadd(dislike_key, disliker_id);
            return { like: -1, dislike: 1 };
        }

        const is_disliker = await this.redisClient.sismember(dislike_key, disliker_id);

        if (is_disliker) {
            await this.redisClient.srem(dislike_key, disliker_id);
            return { like: 0, dislike: -1 };
        } else {
            await this.redisClient.sadd(dislike_key, disliker_id);
            return { like: 0, dislike: 1 };
        }
    }

    async delAllKeys(
        type: types,
        id: string) {
        let cursor = '0';
        const keysToDelete: string[] = [];

        do {
            const [newCursor, keys] = await this.redisClient.scan(cursor, 'MATCH', `${type}:*:${id}`);
            cursor = newCursor;
            keysToDelete.push(...keys);
        } while (cursor !== '0');

        for (const key of keysToDelete) {
            await this.redisClient.del(key);
        }
    }

}


