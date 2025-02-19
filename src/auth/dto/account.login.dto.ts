import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AccountLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(124)
  password: string;
}
