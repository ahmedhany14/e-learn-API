import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';

// auth decorators
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { ROLE } from 'src/auth/decorators/role.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';

// service
import { NotesService } from './notes.service';

// dtos and validators
import { CreateNoteDto } from './dtos/create.note.dto';
import { ExtractAccountData } from 'src/common/decorators/request.extractData.decorator';
import { ObjectIdValidationPipe } from 'src/blog-system/blog/validators/object.id.validation.pipe';

@ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER)
@AUTH(AuthEnum.BEARER)
@Controller('notes')
export class NotesController {

    constructor(
        @Inject()
        private readonly notesService: NotesService
    ) { }

    /**
     * 
     * @param course_id will used later for authorization
     * @param account_id 
     * @param video_id 
     * @body createNoteDto 
     * @returns success message and the created note
     * @description This endpoint is used to create a new note for a video.
     */

    @Post(':course_id/:video_id')
    async createNote(
        @ExtractAccountData('id') account_id: number,
        @Param('video_id', ParseIntPipe) video_id: number,
        @Body() createNoteDto: CreateNoteDto,
    ) {

        const note = await this.notesService.create(
            {
                ...createNoteDto,
                video_id,
                account_id,
            }
        )

        return {
            message: 'Note created successfully',
            data: note,
        };
    }

    /**
     * 
     * @param course_id will used later for authorization
     * @param video_id 
     * @param note_id 
     * @param account_id
     * @returns success message that the note was deleted
     * @description This endpoint is used to delete a note for a video.
     */
    @Delete(':course_id/:video_id/:note_id')
    async deleteNote(
        @ExtractAccountData('id') account_id: number,
        @Param('video_id', ParseIntPipe) video_id: number,
        @Param('note_id', ObjectIdValidationPipe) note_id: string,
    ) {
        await this.notesService.findOneAndDelete(
            {
                note_id,
                video_id,
                account_id,
            }
        )
        return {
            message: 'Note deleted successfully',
            data: {},
        };
    }

    /**
     * 
     * @param course_id will used later for authorization
     * @param video_id 
     * @param account_id
     * @returns success message and the notes
     * @description This endpoint is used to get all notes for a video.
     */
    @Get('course_id/:video_id')
    async getNotes(
        @ExtractAccountData('id') account_id: number,
        @Param('video_id', ParseIntPipe) video_id: number,
    ) {
        const notes = await this.notesService.find(
            {
                video_id,
                account_id,
            }
        )

        // sort the notes by note_time (ascending)
        notes.sort((a, b) => a.note_time - b.note_time)

        return {
            message: 'Notes retrieved successfully',
            data: notes,
        };
    }
}
