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
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(32)
  lastName: string;

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
