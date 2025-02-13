import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountLoginDto {
  @ApiProperty({
    description: 'User email address',
    type: String,
    required: true,
    example: 'user@example.com',
    format: 'email',
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    required: true,
    minLength: 8,
    maxLength: 124,
    example: 'strongPassword123',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(124)
  password: string;
}
