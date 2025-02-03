import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(32)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(32)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(256)
  bio: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(16)
  phone_number: string;
}
