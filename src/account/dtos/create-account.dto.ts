import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '../../auth/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({
    description: 'The email of the account',
    type: String,
    required: true,
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for the account',
    type: String,
    required: true,
    minimum: 6,
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'The role of the account',
    enum: RoleEnum,
    required: true,
    example: RoleEnum.USER,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(RoleEnum, {
    message: `Invalid role. Must be one of: ${Object.values(RoleEnum).join(', ')}`,
  })
  @MaxLength(16)
  role: RoleEnum;

  @ApiProperty({
    description: 'Whether the account is active',
    type: Boolean,
    default: true,
    required: true,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    description: 'Account creation timestamp',
    type: Date,
    required: true,
    example: new Date().toISOString(),
  })
  @IsNotEmpty()
  @IsDate()
  created_at: Date;

  @ApiProperty({
    description: 'Account last update timestamp',
    type: Date,
    required: true,
    example: new Date().toISOString(),
  })
  @IsNotEmpty()
  @IsDate()
  updated_at: Date;
}