import {
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsString,
  IsEmail,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatching implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const object = args.object as any;

    return object.password === object.confirm_password;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match';
  }
}

export class AccountSignupDto {
  @ApiProperty({
    name: 'email',
    description: 'Email address for account registration',
    type: String,
    required: true,
    maxLength: 64,
    example: 'user@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @ApiProperty({
    name: 'password',
    description: 'Account password',
    type: String,
    required: true,
    minLength: 8,
    maxLength: 124,
    example: 'strongPassword123',
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  @Type(() => String)
  password: string;

  @ApiProperty({
    name: 'confirm_password',
    description: 'Confirm account password',
    type: String,
    required: true,
    minLength: 8,
    maxLength: 124,
    example: 'strongPassword123',
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  @Validate(IsPasswordMatching)
  @Type(() => String)
  confirm_password: string;
}
