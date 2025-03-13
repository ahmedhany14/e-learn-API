import {
    IsArray,
    IsString
} from 'class-validator';


export class AddCourseSectionsDto {
    @IsString()
    title: string;
}