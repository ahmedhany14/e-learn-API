import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import {
    BLOG_VIEWS_KEY,
    BLOG_UPVOTES_KEY,
    BLOG_DOWNVOTES_KEY
} from '../../common/constants/blogs.keys';

@Injectable()
export class BlogRedisCachingService {
    constructor(
        @Inject("REDIS_CLIENT")
        private readonly redisClient: Redis
    ) { }

    async setUpVote(
        blog_id: string,
        upvoter_id: number
    ) {
        /*
        Strategy:
        * i will use a set to store the upvotes of a blog
        * i will use the blog id as the key  (blog:upvotes:${blog_id})
        * i will store in each key the id of the author who upvoted the blog
        * to avoid conflicts, i will check if the author id is already in the set (SISMEMBER)
        * if the author id is not in the set, i will add the author id to the set (SADD)
        * if the author id is already in the set, i will remove the author id from the set (SREM)
        * another check: if the user is in the downvotes set, i will remove the user from the downvotes set
        * what will return:
            1) if the user is in the downvotes set, i will return { upvote: 1, downvote: -1 }, to indicate that the downvote was removed and the upvote was added
            2) if the user is in the upvotes set, i will return { upvote: -1, downvote: 0 }, to indicate that the upvote was removed
            3) if the user is not in the upvotes set, i will return { upvote: 1, downvote: 0 }, to indicate that the upvote was
        */

        const downvote_key = BLOG_DOWNVOTES_KEY(blog_id);
        const upvote_key = BLOG_UPVOTES_KEY(blog_id);

        const is_downvoter = await this.redisClient.sismember(downvote_key, upvoter_id);

        if (is_downvoter) {
            await this.redisClient.srem(downvote_key, upvoter_id);
            await this.redisClient.sadd(upvote_key, upvoter_id);
            return { upvote: 1, downvote: -1 };
        }

        const is_upvoter = await this.redisClient.sismember(upvote_key, upvoter_id);

        if (is_upvoter) {
            await this.redisClient.srem(upvote_key, upvoter_id);
            return { upvote: -1, downvote: 0 };
        } else {
            await this.redisClient.sadd(upvote_key, upvoter_id);
            return { upvote: 1, downvote: 0 };
        }
    }


    async setDownVote(
        blog_id: string,
        downvoter_id: number
    ) {
        /*
        Strategy:
        * i will use a set to store the downvotes of a blog
        * i will use the blog id as the key  (blog:downvotes:${blog_id})
        * i will store in each key the id of the author who downvoted the blog
        * to avoid conflicts, i will check if the author id is already in the set (SISMEMBER)
        * if the author id is not in the set, i will add the author id to the set (SADD)
        * if the author id is already in the set, i will remove the author id from the set (SREM)
        * another check: if the user is in the upvotes set, i will remove the user from the upvotes set
        * what will return:
            1) if the user is in the upvotes set, i will return { upvote: -1, downvote: 1 }, to indicate that the upvote was removed and the downvote was added
            2) if the user is in the downvotes set, i will return { upvote: 0, downvote: -1 }, to indicate that the downvote was removed
            3) if the user is not in the downvotes set, i will return { upvote: 0, downvote: 1 }, to indicate that the downvote was added
        */

        const upvote_key = BLOG_UPVOTES_KEY(blog_id);
        const downvote_key = BLOG_DOWNVOTES_KEY(blog_id);

        const is_upvoter = await this.redisClient.sismember(upvote_key, downvoter_id);

        if (is_upvoter) {
            await this.redisClient.srem(upvote_key, downvoter_id);
            await this.redisClient.sadd(downvote_key, downvoter_id);
            return { upvote: -1, downvote: 1 };
        }
        const is_downvoter = await this.redisClient.sismember(downvote_key, downvoter_id);

        if (is_downvoter) {
            await this.redisClient.srem(downvote_key, downvoter_id);
            return { upvote: 0, downvote: -1 };
        } else {
            await this.redisClient.sadd(downvote_key, downvoter_id);
            return { upvote: 0, downvote: 1 };
        }
    }

    async delUpVote(
        blog_id: string,
        upvoter_id: number
    ) {
        /*
        Strategy:
        * i will use a set to store the upvotes of a blog
        * i will use the blog id as the key  (blog:upvotes:${blog_id})
        * i will store in each key the id of the author who upvoted the blog
        * to avoid conflicts, i will check if the author id is already in the set (SISMEMBER)
        * if the author id is in the set, i will remove the author id from the set (SREM) and return -1 to indicate that the upvote was removed
        * if the author id is not in the set, i will return 0 to indicate that the upvote was not removed

        */

        const upvote_key = BLOG_UPVOTES_KEY(blog_id);
        const is_upvoter = await this.redisClient.sismember(upvote_key, upvoter_id);

        if (is_upvoter) {
            await this.redisClient.srem(upvote_key, upvoter_id);
            return -1;
        }

        return 0;
    }
    async delDownVote(
        blog_id: string,
        downvoter_id: number
    ) {
        /*
        Strategy:
        * i will use a set to store the downvotes of a blog
        * i will use the blog id as the key  (blog:downvotes:${blog_id})
        * i will store in each key the id of the author who downvoted the blog
        * to avoid conflicts, i will check if the author id is already in the set (SISMEMBER)
        * if the author id is in the set, i will remove the author id from the set (SREM) and return -1 to indicate that the downvote was removed
        * if the author id is not in the set, i will return 0 to indicate that the downvote was not removed
        */

        const downvote_key = BLOG_DOWNVOTES_KEY(blog_id);
        const is_downvoter = await this.redisClient.sismember(downvote_key, downvoter_id);

        if (is_downvoter) {
            await this.redisClient.srem(downvote_key, downvoter_id);
            return -1;
        }
        return 0;
    }

    async incViews(
        blog_id: string,
        viewer_id: number
    ) {
        /*
        Strategy:
        * i will use hyperloglog to store the views of a blog
        * i will use the blog id as the key  (blog:views:${blog_id})
        * i will store in each key the id of the author who viewed the blog
        * to avoid conflicts, i will try to add the author id to the hyperloglog
        * if redis returns 1, then the author id was added successfully, so i will increment the views count
        * if redis returns 0, then the author id was already added, so i will not increment the views count
        */
        const key = BLOG_VIEWS_KEY(blog_id);

        const is_added = await this.redisClient.pfadd(key, viewer_id);
        return is_added ? 1 : 0;
    }

    async delAllBlogKeys(blog_id: string) {
        let cursor = '0';
        const keysToDelete: string[] = [];

        do {
            const [newCursor, keys] = await this.redisClient.scan(cursor, 'MATCH', `blog:*:${blog_id}`);

            keysToDelete.push(...keys);
            cursor = newCursor;

        } while (cursor !== '0');

        if (keysToDelete.length > 0) {
            for (const key of keysToDelete)
                await this.redisClient.del(key);
        }
    }
}
