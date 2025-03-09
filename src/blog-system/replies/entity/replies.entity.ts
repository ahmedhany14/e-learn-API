import {
    Prop,
    Schema,
    SchemaFactory
} from '@nestjs/mongoose';
import e from 'express';

import mongoose, { Document } from 'mongoose';

export type RepliesDocument = Replies & Document;

@Schema({
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
})
export class Replies extends Document {
    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
        minlength: 1,
    })
    reply: string;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
        isInteger: true,
        MIN_VALUE: 0,
    })
    reply_by: number;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
        isInteger: true,
        MIN_VALUE: 0,
    })
    reply_to: number;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Comment',
    })
    comment_id: string;

    @Prop({
        type: mongoose.Schema.Types.Number,
        default: 0
    })
    likes: number;

    @Prop({
        type: mongoose.Schema.Types.Number,
        default: 0
    })
    dislikes: number;
}

export const RepliesSchema = SchemaFactory.createForClass(Replies);