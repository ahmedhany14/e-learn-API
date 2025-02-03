import {
  IsString,
  IsNotEmpty,
  Matches,
  IsCreditCard,
} from 'class-validator';

export class UpgradeToInstructorDto {
  @IsString()
  @IsNotEmpty({ message: 'Payment information is required.' })
  @IsCreditCard({ message: 'Invalid credit card number.' })
  payment_info: string;

  @IsString()
  @IsNotEmpty({ message: 'National ID is required.' })
  @Matches(/^\d{10,14}$/, { message: 'National ID must be between 10 and 14 digits.' })
  national_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Stripe account information is required.' })
  @Matches(/^acct_[a-zA-Z0-9]{16}$/, { message: 'Invalid Stripe account format. It should start with "acct_" followed by 16 alphanumeric characters.' })
  stripe_info: string;
}
