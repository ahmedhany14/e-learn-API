import { AbstractDocument } from '@app/abstract.mongo';
import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


@Schema({
    collection: 'video-comments',
    timestamps: true,
    versionKey: false,
})

export class VideoCommentsDocument extends AbstractDocument {

    @Prop({
        type: String,
        required: true,
    })
    content: string;

    @Prop({
        type: Number,
        required: true,
        default: 0,
    })
    upvotes: number;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
    })
    account_id: number;

    @Prop({
        type: Number,
        required: true,
    })
    course_id: number;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
    })
    video_id: number;
}

export const VideoCommentsSchema = SchemaFactory.createForClass(VideoCommentsDocument);