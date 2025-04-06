import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRerpositort } from '@app/abstract.mongo';
import { VideoNotesDocument } from './schema/video.notes.schema';

@Injectable()
export class NotesService extends AbstractRerpositort<VideoNotesDocument> {
    constructor(
        @InjectModel(VideoNotesDocument.name)
        private readonly noteModel: Model<VideoNotesDocument>,
    ) {
        super(noteModel);
    }
}
