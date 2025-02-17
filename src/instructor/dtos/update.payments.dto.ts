import {
  IsCreditCard,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@ValidatorConstraint({
  name: 'atLeastOneFieldRequired',
  async: false,
})
class AtLeastOneFieldRequired implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const otherField =
      args.property === 'payment_info' ? 'stripe_info' : 'payment_info';
    return value || object[otherField]; // Ensure at least one field has a value
  }

  defaultMessage(args: ValidationArguments) {
    return 'At least one of payment_info or stripe_info must be provided.'; // Error message if both are empty
  }
}

export class UpdatePaymentsDto {
  @ApiProperty({
    description: 'Credit card number',
    example: '4111111111111111',
    required: false,
    minLength: 16,
    maxLength: 124,
  })
  @IsString()
  @IsOptional()
  @MaxLength(124)
  @MinLength(16)
  @IsCreditCard({ message: 'Invalid credit card number.' })
  @Validate(AtLeastOneFieldRequired) // Validate that at least one of the fields is filled
  payment_info: string;

  @ApiProperty({
    description: 'Stripe account ID',
    example: 'acct_1Ku3gq2eZvKYlo2C',
    required: false,
    minLength: 16,
    maxLength: 64,
  })
  @IsString()
  @IsOptional()
  @MaxLength(64)
  @MinLength(16)
  @Matches(/^acct_[a-zA-Z0-9]{16}$/, {
    message:
      'Invalid Stripe account format. It should start with "acct_" followed by 16 alphanumeric characters.',
  })
  @Validate(AtLeastOneFieldRequired) // Validate that at least one of the fields is filled
  stripe_info: string;
}
