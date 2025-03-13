import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { RepliesRepositoryService } from './replies.repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Replies, RepliesSchema } from './entity/replies.entity';
import { CommentsModule } from '../comments/comments.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Replies.name, schema: RepliesSchema }
        ]),
        CommentsModule,
        RedisModule
    ],
    controllers: [RepliesController],
    providers: [RepliesService, RepliesRepositoryService]
})
export class RepliesModule { }
