import { Injectable } from '@nestjs/common';
import { VideoCommentsDocument } from './schema/video.comments.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRerpositort } from '@app/abstract.mongo';

@Injectable()
export class CommentsService extends AbstractRerpositort<VideoCommentsDocument> {
    constructor(
        @InjectModel(VideoCommentsDocument.name)
        private readonly commentModel: Model<VideoCommentsDocument>,
    ) {
        super(commentModel);
    }
}
