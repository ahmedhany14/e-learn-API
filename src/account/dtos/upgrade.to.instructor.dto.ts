import {
  IsString,
  IsNotEmpty,
  Matches,
  IsCreditCard,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpgradeToInstructorDto {
  @ApiProperty({
    description: 'Credit card number for payment processing',
    type: String,
    required: true,
    example: '4111111111111111',
  })
  @IsString()
  @IsNotEmpty({ message: 'Payment information is required.' })
  @IsCreditCard({ message: 'Invalid credit card number.' })
  payment_info: string;

  @ApiProperty({
    description: 'National ID number for verification',
    type: String,
    required: true,
    example: '1234567890',
    pattern: '^\\d{10,14}$',
  })
  @IsString()
  @IsNotEmpty({ message: 'National ID is required.' })
  @Matches(/^\d{10,14}$/, {
    message: 'National ID must be between 10 and 14 digits.'
  })
  national_id: string;

  @ApiProperty({
    description: 'Stripe account identifier for payment processing',
    type: String,
    required: true,
    example: 'acct_1234567890abcdef',
    pattern: '^acct_[a-zA-Z0-9]{16}$',
  })
  @IsString()
  @IsNotEmpty({ message: 'Stripe account information is required.' })
  @Matches(/^acct_[a-zA-Z0-9]{16}$/, {
    message: 'Invalid Stripe account format. It should start with "acct_" followed by 16 alphanumeric characters.'
  })
  stripe_info: string;
}