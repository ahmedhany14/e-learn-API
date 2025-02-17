import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'URL of the course image',
    example: 'https://example.com/course-image.jpg',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  image_url: string;

  @ApiProperty({
    description: 'Price of the course',
    example: 99.99,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  price: number;

  // @IsString()
  // @IsOptional()
  // plan: string;

  @ApiProperty({
    description: 'Detailed description of the course content',
    example: 'This course covers fundamental concepts of web development...',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Prerequisites and requirements for taking the course',
    example: 'Basic knowledge of JavaScript, Computer with Node.js installed',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  requirements: string;

  @ApiProperty({
    description: 'Learning outcomes and skills to be gained',
    example:
      'Build full-stack applications, Deploy web applications, Write clean code',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  what_you_learn: string;
}