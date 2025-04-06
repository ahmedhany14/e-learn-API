import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';

import { VideoNotesDocument, VideoNotesSchema } from './schema/video.notes.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: VideoNotesDocument.name,
                schema: VideoNotesSchema,
            },
        ]),
    ],
    controllers: [NotesController],
    providers: [NotesService]
})
export class VideoNotesModule { }
