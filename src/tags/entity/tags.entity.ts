import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TagsDocument = Tags & Document;

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
export class Tags extends Document {

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
    })
    category: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
    })
    subcategory: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    })
    tag: string;

    @Prop({
        type: mongoose.Schema.Types.String,
        required: true,
    })
    description: string;

    @Prop({
        type: mongoose.Schema.Types.Number,
        required: true,
    })
    tag_creator: number
}

export const TagsSchema = SchemaFactory.createForClass(Tags);