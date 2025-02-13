import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatching implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;

    return object.new_password === object.confirm_password;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match';
  }
}

export class AccountResetPasswordDto {

  @ApiProperty({
    name: 'old_password',
    description: 'Current password of the account',
    type: String,
    required: true,
    minLength: 8,
    maxLength: 124,
    example: 'currentPass123',
    format: 'password'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  old_password: string;

  @ApiProperty({
    name: 'new_password',
    description: 'New password for the account',
    type: String,
    required: true,
    minLength: 8,
    maxLength: 124,
    example: 'newPass123',
    format: 'password'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  @Type(() => String)
  new_password: string;

  @ApiProperty({
    name: 'confirm_password',
    description: 'Confirm the new password',
    type: String,
    required: true,
    minLength: 8,
    maxLength: 124,
    example: 'newPass123',
    format: 'password'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  @Validate(IsPasswordMatching)
  @Type(() => String)
  confirm_password: string;
}
