import { AbstractDocument } from '@app/abstract.mongo';
import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


@Schema({
    collection: 'video-notes',
    timestamps: true,
    versionKey: false,
})
export class VideoNotesDocument extends AbstractDocument {

    @Prop({
        type: String,
        required: true,
    })
    note: string;

    @Prop({
        type: Number,
        required: true,
    })
    note_time: number;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
    })
    video_id: number;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
    })
    account_id: number;
}

export const VideoNotesSchema = SchemaFactory.createForClass(VideoNotesDocument);