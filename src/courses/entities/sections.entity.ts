import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type SectionDocument = Section & Document;

@Schema()
export class Section {
  @Prop({ required: true })
  title: string;

  @Prop({ default: 1 })
  order: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Videos' })
  videos_id: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course_id: string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
