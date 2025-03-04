import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength
} from 'class-validator';

export class CreateBlogDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
    title: string;


    @IsString()
    @IsNotEmpty()
    content: string;
}