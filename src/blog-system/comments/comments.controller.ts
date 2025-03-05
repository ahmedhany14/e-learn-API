import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

// dtos
import { CreateCommentDto } from './dtos/create.comment.dto';
import { UpdateCommentDto } from './dtos/update.comment.dto';

// validators
import { ObjectIdValidationPipe } from '../blog/validators/object.id.validation.pipe';

// services
import { CommentsService } from './comments.service';
import { CommentRedisCachingService } from '../../redis/services/comment.redis.caching.service';
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';
import { ExtractAccountData } from '../../common/decorators/request.extractData.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    @Inject()
    private readonly commentsService: CommentsService,
    @Inject()
    private readonly commentRedisCachingService: CommentRedisCachingService,
  ) {}

  @AUTH(AuthEnum.BEARER)
  @Post(':blog_id')
  async addComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
    @ExtractAccountData('id') author_id: number,
  ) {
    const comment = await this.commentsService.addComment(
      createCommentDto,
      blog_id,
      author_id,
    );

    return {
      response: {
        message: 'Comment Added Successfully',
        data: comment,
      },
    };
  }

  @Get(':comment_id')
  async getComment(
    @Param('comment_id', ObjectIdValidationPipe) comment_id: string,
  ) {
    const comment = await this.commentsService.getComment(comment_id);
    return {
      response: {
        message: 'Comment Fetched Successfully',
        data: comment,
      },
    };
  }

  @AUTH(AuthEnum.BEARER)
  @Delete(':comment_id')
  async deleteComment(
    @Param('comment_id', ObjectIdValidationPipe) comment_id: string,
    @ExtractAccountData('id') deleter_id: number,
  ) {
    await this.commentsService.deleteComment(comment_id, deleter_id);
    await this.commentRedisCachingService.delAllCommnetKeys(comment_id);

    return {
      response: {
        message: 'Comment Deleted Successfully',
      },
    };
  }

  @AUTH(AuthEnum.BEARER)
  @Put(':comment_id')
  async editComment(
    @Param('comment_id', ObjectIdValidationPipe) comment_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @ExtractAccountData('id') author_id: number,
  ) {
    const comment = await this.commentsService.updateComment(
      comment_id,
      updateCommentDto,
      author_id,
    );
    return {
      response: {
        message: 'Comment Edited Successfully',
        data: comment,
      },
    };
  }

  @Get('blog_comments/:blog_id')
  async getBlogComments(
    @Param('blog_id', ObjectIdValidationPipe) blog_id: string,
    @Query('page') page: number = 1,
  ) {
    const response = await this.commentsService.getBlogComments(blog_id, page);

    return response;
  }

  @AUTH(AuthEnum.BEARER)
  @Patch('like/:comment_id')
  async likeComment(
    @Param('comment_id', ObjectIdValidationPipe) comment_id: string,
    @ExtractAccountData('id') liker_id: number,
  ) {
    const comment = await this.commentsService.getComment(comment_id);
    if (!comment) throw new NotFoundException('Comment not found');

    const redis_ret = await this.commentRedisCachingService.setLikeToComment(
      comment_id,
      liker_id,
    );

    await this.commentsService.likeComment(comment_id, redis_ret.like);
    await this.commentsService.dislikeComment(comment_id, redis_ret.dislike);

    return {
      response: {
        like: redis_ret.like === 1 ? 'Comment Liked' : 'Comment Like Removed',
        dislike:
          redis_ret.dislike === 1
            ? 'Comment Disliked'
            : 'Comment Dislike Removed',
      },
    };
  }

  @Patch('dislike/:comment_id')
  async dislikeComment(
    @Param('comment_id', ObjectIdValidationPipe) comment_id: string,
    @ExtractAccountData('id') disliker_id: number,
  ) {
    const comment = await this.commentsService.getComment(comment_id);
    if (!comment) throw new NotFoundException('Comment not found');

    const redis_ret = await this.commentRedisCachingService.setDislikeToComment(
      comment_id,
      disliker_id,
    );

    await this.commentsService.likeComment(comment_id, redis_ret.like);
    await this.commentsService.dislikeComment(comment_id, redis_ret.dislike);

    return {
      response: {
        like: redis_ret.like === 1 ? 'Comment Liked' : 'Comment Like Removed',
        dislike:
          redis_ret.dislike === 1
            ? 'Comment Disliked'
            : 'Comment Dislike Removed',
      },
    };
  }

  @Get(':comment_id/replies')
  async getReplies() {
    /*
        Not Planned Yet
    */
    return 'Not Planned Yet';
  }

  @Post(':comment_id/replies')
  async addReply() {
    /*
        Not Planned Yet
    */
    return 'Not Planned Yet';
  }
}
