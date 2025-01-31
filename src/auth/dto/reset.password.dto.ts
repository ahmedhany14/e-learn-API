import {
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

// decorator
import { IsPasswordMatching } from '../../common/decorators/password.validation.decotator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Validate(IsPasswordMatching)
  confirmPassword: string;


}
