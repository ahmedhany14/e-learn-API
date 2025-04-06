import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoCommentsDocument, VideoCommentsSchema } from './schema/video.comments.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: VideoCommentsDocument.name,
                schema: VideoCommentsSchema,
            }
        ]),
    ],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class VideoCommentsModule { }
