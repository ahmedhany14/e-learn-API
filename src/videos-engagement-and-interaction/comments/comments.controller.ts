import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

// auth decorators
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { ROLE } from 'src/auth/decorators/role.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';

import { ObjectIdValidationPipe } from 'src/blog-system/blog/validators/object.id.validation.pipe';
import { ExtractAccountData } from 'src/common/decorators/request.extractData.decorator';
import { CreateCommentDto } from 'src/blog-system/comments/dtos/create.comment.dto';

@ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER)
@AUTH(AuthEnum.BEARER)
@Controller('course-comments')
export class CommentsController {
    constructor(
        @Inject()
        private readonly commentsService: CommentsService,
    ) { }

    @Get('/:course_id')
    async getCourseComments(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        const response = await this.commentsService.paginate(
            {
                course_id,
            },
            {
                page,
                limit: 10,
                sort: {
                    created_at: -1,
                },
            },
            `http://localhost:3000/course-comments/${course_id}`,
        )

        return response;
    }

    @Get(':course_id/:video_id')
    async getVideoComments(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Param('video_id', ParseIntPipe) video_id: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        const response = await this.commentsService.paginate(
            {
                course_id,
                video_id,
            },
            {
                page,
                limit: 10,
                sort: {
                    created_at: -1,
                },
            },
            `http://localhost:3000/course-comments/${course_id}/${video_id}`,
        )

        return response;
    }

    @Get(':course_id/:video_id/:comment_id')
    async getComment(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Param('video_id', ParseIntPipe) video_id: number,
        @Param('comment_id', ObjectIdValidationPipe) comment_id: string,
    ) {
        const response = await this.commentsService.findOne({
            course_id,
            video_id,
            comment_id,
        })

        return {
            message: 'Comment fetched successfully',
            data: response,
        }
    }


    @Post(':course_id/:video_id')
    async createComment(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Param('video_id', ParseIntPipe) video_id: number,
        @ExtractAccountData('id') account_id: number,
        @Body() createCommentDto: CreateCommentDto
    ) {
        const comment = await this.commentsService.create({
            ...createCommentDto,
            upvotes: 0,
            course_id,
            video_id,
            account_id,
        })

        return {
            message: 'Comment created successfully',
            data: comment,
        }
    }
}
