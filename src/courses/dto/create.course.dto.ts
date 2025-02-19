import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  image_url: string;

  @IsNumber()
  @IsOptional()
  price: number;

  // @IsString()
  // @IsOptional()
  // plan: string;
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  requirements: string;

  @IsString()
  @IsNotEmpty()
  what_you_learn: string;
}