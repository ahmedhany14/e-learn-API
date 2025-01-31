import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate
} from 'class-validator';
import { IsPasswordMatching } from 'src/common/decorators/password.validation.decotator';

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
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(124)
  @Validate(IsPasswordMatching)
  confirmPassword: string;
}
