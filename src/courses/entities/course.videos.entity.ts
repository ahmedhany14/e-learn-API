import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CourseDocument = CourseVideos & Document;


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
export class CourseVideos extends Document {

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
        minlength: 5,
        maxlength: 32,
    })
    title: string;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
    })
    section: number;

    @Prop({
        type: mongoose.Schema.Types.Number
    })
    duration: number;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
    })
    video_url: string;
}


export const CourseVideosSchema = SchemaFactory.createForClass(CourseVideos);