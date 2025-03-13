import { Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBlogDto } from './dtos/create.blog.dto';
import { UpdateBlogDto } from './dtos/update.blog.dto';
import { BlogRepositoryService } from './blog.repository.service';
@Injectable()
export class BlogService {
    constructor(
        @Inject()
        private readonly blogRepositoryService: BlogRepositoryService,
    ) { }


    async createBlog(createBlogDto: CreateBlogDto, author_id: number) {
        return await this.blogRepositoryService.createBlog(createBlogDto, author_id);
    }

    async getOneBlog(id: string) {
        return await this.blogRepositoryService.getOneBlog(id);
    }

    async incrementViews(blog_id: string) {
        const blog = await this.blogRepositoryService.getOneBlog(blog_id);
        if (!blog) throw new NotFoundException('Blog not found');

        return await this.blogRepositoryService.incrementViews(blog);
    }


    async updateBlog(
        updateBlogDto: UpdateBlogDto,
        blog_id: string,
        author_id: number
    ) {
        const blog = await this.blogRepositoryService.getOneBlog(blog_id);
        if (!blog) throw new NotFoundException('Blog not found');
        if (blog.author_id !== author_id) throw new UnauthorizedException('You are not authorized to update this blog');

        return await this.blogRepositoryService.updateBlog(blog, updateBlogDto);
    }

    async deleteBlog(
        author_id: number,
        blog_id: string
    ) {
        const blog = await this.blogRepositoryService.getOneBlog(blog_id);
        if (!blog) throw new NotFoundException('Blog not found');
        if (blog.author_id !== author_id) throw new UnauthorizedException('You are not authorized to update this blog');

        await this.blogRepositoryService.deleteBlog(blog);
    }

    async upvoteBlog(id: string, inc: number) {
        await this.blogRepositoryService.upvoteBlog(id, inc);
    }

    async downvoteBlog(id: string, inc: number) {
        await this.blogRepositoryService.downvoteBlog(id, inc);
    }

    async getBlogs(author_id: number, page: number) {
        return await this.blogRepositoryService.getBlogs(author_id, page)
    }
}
