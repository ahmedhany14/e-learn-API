import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
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
}
