import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddVideoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duration: number;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  video_url: string;
}
