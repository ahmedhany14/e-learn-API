import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepositoryService } from './comments.repository.service';
import { BlogModule } from '../blog/blog.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entity/comment.entity';
import { RedisModule } from '../../redis/redis.module';

@Module({
    imports: [
        BlogModule,
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
        RedisModule,
    ],
    controllers: [CommentsController],
    providers: [CommentsService, CommentsRepositoryService],
    exports: [CommentsService],
})
export class CommentsModule { }
