import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import {
    BLOG_VIEWS_KEY,
} from '../../common/constants/redis-keys/blogs.keys';

@Injectable()
export class BlogRedisCachingService {
    constructor(
        @Inject("REDIS_CLIENT")
        private readonly redisClient: Redis
    ) { }

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
}
