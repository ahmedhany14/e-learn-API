import {
    IsArray,
    IsString
} from 'class-validator';


export class AddCourseSectionsDto {
    @IsString()
    section: string;
}