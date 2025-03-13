import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

// Dtos
import { CreateCommentDto } from './dtos/create.comment.dto';
import { UpdateCommentDto } from './dtos/update.comment.dto';

// Service
import { BlogService } from '../blog/blog.service';
import { CommentsRepositoryService } from './comments.repository.service';

@Injectable()
export class CommentsService {
    constructor(
        @Inject()
        private readonly commentsRepositoryService: CommentsRepositoryService,
        @Inject()
        private readonly blogService: BlogService
    ) { }

    async addComment(
        createCommentDto: CreateCommentDto,
        blog_id: string,
        author_id: number
    ) {
        const blog = await this.blogService.getOneBlog(blog_id);
        if (!blog) throw new NotFoundException('Blog not found');

        return await this.commentsRepositoryService.addComment(createCommentDto, blog_id, author_id);
    }

    async getComment(comment_id: string) {
        return await this.commentsRepositoryService.getComment(comment_id);
    }

    async deleteComment(comment_id: string, deleter_id: number) {
        const comment = await this.commentsRepositoryService.getComment(comment_id);

        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.author_id !== deleter_id) throw new UnauthorizedException('You are not allowed to delete this comment');

        await this.commentsRepositoryService.deleteComment(comment_id);
    }

    async updateComment(comment_id: string, updateCommentDto: UpdateCommentDto, updater_id: number) {
        const comment = await this.commentsRepositoryService.getComment(comment_id);

        if (!comment) throw new NotFoundException('Comment not found');
        if (comment.author_id !== updater_id) throw new UnauthorizedException('You are not allowed to update this comment');

        return await this.commentsRepositoryService.updateComment(comment_id, updateCommentDto);
    }

    async getBlogComments(blog_id: string, page: number) {
        return await this.commentsRepositoryService.getBlogComments(blog_id, page);
    }

    async likeComment(comment_id: string, inc: number) {
        return await this.commentsRepositoryService.likeComment(comment_id, inc);
    }

    async dislikeComment(comment_id: string, inc: number) {
        return await this.commentsRepositoryService.dislikeComment(comment_id, inc);
    }
}
