import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type VideosDocument = Videos & Document;

@Schema()
export class Videos {
  @Prop({ required: true })
  title: string;

  @Prop()
  duration: number;

  @Prop({
    required: true,
    unique: true,
  })
  video_url: string;

  @Prop({ default: 1 })
  order: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Section',
  })
  section: mongoose.Schema.Types.ObjectId;
}

export const VideosSchema = SchemaFactory.createForClass(Videos);
