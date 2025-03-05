import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { CourseStatusEnum } from '../enums/course.status.enum';

export type CourseDocument = Course & Document;

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
export class Course extends Document {

    @Prop({
        type: mongoose.Schema.Types.String,
        required: false,
        minlength: 5,
        maxlength: 256,
    })
    image_url: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        default: "No Title Provided",
        required: true,
        minlength: 5,
        maxlength: 100,
    })
    title: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        default: "No Description Provided",
        required: true,
    })
    description: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        default: "No Requirements Provided",
        required: true,
    })
    requirements: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        default: "No What You Learn Provided",
        required: true,
    })
    what_you_learn: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        default: "draft",
        enum: CourseStatusEnum,
        required: true,
    })
    state: string;

    @Prop({
        type: mongoose.Schema.Types.Number,
        default: 0,
    })
    price: number;

    @Prop({
        type: mongoose.Schema.Types.Array,
    })
    course_sections: string[];


    @Prop({
        type: mongoose.Schema.Types.Number,
        default: 0
    })
    views: number;


    @Prop({
        type: mongoose.Schema.Types.Number,
        default: 0
    })
    rate: number;


    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
    })
    instructor: number;


    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'CourseVideos'
    })
    videos: string[];


    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tags'
    })
    tags: string[];

    //plans: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);