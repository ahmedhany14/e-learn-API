import {
    Prop,
    Schema,
    SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type VideosDocument = Videos & Document;


@Schema()
export class Videos {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    section: number;

    @Prop()
    duration: number;

    @Prop({ required: true })
    video_url: string;

    @Prop({ default: 1 })
    order: number;
}   

export const VideosSchema = SchemaFactory.createForClass(Videos);