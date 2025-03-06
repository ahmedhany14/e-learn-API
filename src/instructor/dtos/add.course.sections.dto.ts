import {
    IsArray,
    IsString
} from 'class-validator';


export class AddCourseSectionsDto {
    @IsArray()
    @IsString({ each: true })
    sections: string[];
}