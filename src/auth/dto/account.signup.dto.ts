import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional, Matches,
} from 'class-validator';

export class AccountSignupDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  @MinLength(10)
  @Matches(/^\d+$/, { message: 'Phone number must contain only numbers' })
  phone_number?: string;
}
