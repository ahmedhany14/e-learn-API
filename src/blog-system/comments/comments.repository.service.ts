import { Injectable, InternalServerErrorException } from '@nestjs/common';

// Entity and Model
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entity/comment.entity';

// Dtos
import { CreateCommentDto } from './dtos/create.comment.dto';
import { UpdateCommentDto } from './dtos/update.comment.dto';

@Injectable()
export class CommentsRepositoryService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }


    async addComment(
        createCommentDto: CreateCommentDto,
        blog_id: string,
        author_id: number
    ): Promise<CommentDocument> {
        try {
            const comment = new this.commentModel({
                ...createCommentDto,
                blog_id,
                author_id
            });

            return comment.save();
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while adding comment',
                details: "can't add comment, please try again"
            });
        }
    }

    async getComment(comment_id: string): Promise<CommentDocument> {
        try {
            return this.commentModel.findById(comment_id);
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while fetching comment',
                details: "can't fetch comment, please try again"
            });
        }
    }

    async deleteComment(comment_id: string): Promise<void> {
        try {
            await this.commentModel.findByIdAndDelete(comment_id);
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while deleting comment',
                details: "can't delete comment, please try again"
            });
        }
    }

    async updateComment(
        comment_id: string,
        updateCommentDto: UpdateCommentDto
    ): Promise<CommentDocument> {
        try {
            return this.commentModel.findByIdAndUpdate(comment_id, updateCommentDto, { new: true });
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while updating comment',
                details: "can't update comment, please try again"
            });
        }
    }

    async likeComment(comment_id: string, inc: number) {
        try {
            return this.commentModel.findByIdAndUpdate(comment_id, { $inc: { likes: inc } });
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while liking comment',
                details: "can't like comment, please try again"
            });
        }

    }

    async dislikeComment(comment_id: string, inc: number) {
        try {
            return this.commentModel.findByIdAndUpdate(comment_id, { $inc: { dislikes: inc } });
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while disliking comment',
                details: "can't dislike comment, please try again"
            });
        }
    }

    async getBlogComments(blog_id: string, page: number) {
        try {
            console.log('blog_id', blog_id);
            const data = await this.commentModel.find({ blog_id }).skip((page - 1) * 10).limit(10);

            const totalComments = await this.commentModel.find({ blog_id }).countDocuments();
            const totalPages = Math.ceil(totalComments * 1.0 / 10);
            const hasNextPage = page < totalPages;

            return {
                response: data,
                meta: {
                    total: totalComments,
                    page,
                    limit: 10,
                    totalPages,
                    hasNextPage,
                    firstPage: `blog_comments/${blog_id}?page=1`,
                    lastPage: `blog_comments/${blog_id}?page=${totalPages}`,
                    nextPage: hasNextPage ? `blog_comments/${blog_id}?page=${page + 1}` : null,
                    prevPage: page > 1 ? `blog_comments/${blog_id}?page=${page - 1}` : null,
                    currentPage: `blog_comments/${blog_id}?page=${page}`
                }
            }

        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Error while fetching comments',
                details: "can't fetch comments, please try again"
            });
        }
    }
}
