import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CommentDocument = Comment & Document;


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
export class Comment extends Document {
    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
        minlength: 1,
    })
    content: string;

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

    @Prop({
        required: true,
        isInteger: true,
        MIN_VALUE: 0,
    })
    author_id: number;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    })
    blog_id: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);