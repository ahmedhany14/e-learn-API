import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    MinLength,
    MaxLength,
    IsPositive,
} from 'class-validator';


export class UpdateCourseDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(5)
    @MaxLength(100)
    title?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    requirements?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    what_you_learn: string;


    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
}