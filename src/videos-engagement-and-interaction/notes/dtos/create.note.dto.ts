import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsPositive
} from 'class-validator';


export class CreateNoteDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    note: string;

    @IsDefined()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    note_time: number;
}