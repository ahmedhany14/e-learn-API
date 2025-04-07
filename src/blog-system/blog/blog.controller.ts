import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

// DTOs
import { UpdateBlogDto } from './dtos/update.blog.dto';
import { CreateBlogDto } from './dtos/create.blog.dto';

// Services
import { BlogService } from './blog.service';
import { BlogRedisCachingService } from '../../redis/services/blog.redis.caching.service';
import { ReactisRedisCachingService } from 'src/redis/services/reactis.redis.caching.service';

// Pipes
import { ObjectIdValidationPipe } from './validators/object.id.validation.pipe';

// decorators for auth
import { AUTH } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { ExtractAccountData } from '@app/decorators';
import { types } from 'src/common/enums/react.to.types';

@Controller('blog')
export class BlogController {
    constructor(
        @Inject()
        private readonly blogService: BlogService,

        @Inject()
        private readonly blogRedisCachingService: BlogRedisCachingService,

        @Inject()
        private readonly reactisRedisCachingService: ReactisRedisCachingService,
    ) {}

    @AUTH(AuthEnum.BEARER)
    @Post('create-blog')
    async createBlog(
        @ExtractAccountData('id') author_id: number,
        @Body() createBlogDto: CreateBlogDto,
    ) {
        console.log('author_id', author_id);
        const blog = await this.blogService.createBlog(createBlogDto, author_id);
        return {
            response: {
                message: 'Blog created',
                blog,
            },
        };
    }

    @AUTH(AuthEnum.BEARER)
    @Get('get-one-blog/:blog_id')
    async getOneBlog(
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
        @ExtractAccountData('id') author_id: number,
    ) {
        /*
            Cache the views of the blog
        */
        let blog;

        // NOTE: The second arg will be fixed after adding authentication
        if (await this.blogRedisCachingService.incViews(blog_id, 10))
            blog = await this.blogService.incrementViews(blog_id);
        else blog = await this.blogService.getOneBlog(blog_id);

        return {
            response: {
                message: 'Blog fetched',
                blog,
            },
        };
    }

    @Get('get-blogs/:author_id')
    async getBlogs(
        @Param('author_id', ParseIntPipe) author_id: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        const full_data = await this.blogService.getBlogs(author_id, page);
        return full_data;
    }

    @AUTH(AuthEnum.BEARER)
    @Patch('update-blog/:blog_id')
    async updateBlog(
        @ExtractAccountData('id') author_id: number,
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        const blog = await this.blogService.updateBlog(updateBlogDto, blog_id, author_id);

        return {
            response: {
                message: 'Blog updated',
                blog,
            },
        };
    }

    @AUTH(AuthEnum.BEARER)
    @Delete('delete-blog/:blog_id')
    async deleteBlog(
        @ExtractAccountData('id') author_id: number,
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
    ) {
        await this.blogService.deleteBlog(author_id, blog_id);

        await this.reactisRedisCachingService.delAllKeys(types.BLOG, blog_id);

        return {
            response: {
                message: 'Blog deleted',
            },
        };
    }

    @AUTH(AuthEnum.BEARER)
    @Post('upvote-blog/:blog_id/')
    async upvoteBlog(
        @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
        @ExtractAccountData('id') upvoter_id: number,
    ) {
        const blog = await this.blogService.getOneBlog(blog_id);

        if (!blog) throw new NotFoundException('Blog not found');

        const ret = await this.reactisRedisCachingService.setLike(types.BLOG, blog_id, upvoter_id);

        await this.blogService.upvoteBlog(blog_id, ret.like);
        await this.blogService.downvoteBlog(blog_id, ret.dislike);

        return {
            response: {
                upvote: ret.like === 1 ? 'Blog upvoted' : 'Blog upvote removed',
                downvote: ret.dislike === 1 ? 'Blog downvoted' : 'Blog downvote removed',
            },
        };
    }

    @AUTH(AuthEnum.BEARER)
    @Post('downvote-blog/:blog_id')
    async downvoteBlog(
        @Param('blog_id') blog_id: string,
        @ExtractAccountData('id') downvoter_id: number,
    ) {
        const blog = await this.blogService.getOneBlog(blog_id);
        if (!blog) throw new NotFoundException('Blog not found');

        const ret = await this.reactisRedisCachingService.setDislike(
            types.BLOG,
            blog_id,
            downvoter_id,
        ); // 1 ? will increase the downvote count : -1 ? will decrease the downvote count

        await this.blogService.upvoteBlog(blog_id, ret.like);
        await this.blogService.downvoteBlog(blog_id, ret.dislike);

        return {
            response: {
                upvote: ret.like === 1 ? 'Blog upvoted' : 'Blog upvote removed',
                downvote: ret.dislike === 1 ? 'Blog downvoted' : 'Blog downvote removed',
            },
        };
    }
}
