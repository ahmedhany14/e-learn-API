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

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatching implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;

    return object.newPassword === confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Passwords do not match';
  }
}

export class AccountResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  @Type(() => String)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  @Validate(IsPasswordMatching)
  @Type(() => String)
  confirmPassword: string;
}
