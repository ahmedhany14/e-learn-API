import {
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsString,
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

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password for the account',
    type: String,
    required: true,
    minLength: 8,
    maxLength: 124,
    example: 'newSecurePass123',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(124)
  @Type(() => String)
  password: string;

  @ApiProperty({
    description: 'Confirm new password for the account',
    type: String,
    required: true,
    minLength: 8,
    maxLength: 124,
    example: 'newSecurePass123',
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(124)
  @Validate(IsPasswordMatching)
  @Type(() => String)
  confirm_password: string;
}
