import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  category: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  subcategory: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  tag: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
