import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  image_url: string;

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
