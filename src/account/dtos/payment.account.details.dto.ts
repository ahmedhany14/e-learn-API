import {
    IsString,
    IsNotEmpty,
    Matches,
} from 'class-validator';

export class PaymentAccountDetailsDto {
    @IsString()
    @IsNotEmpty({ message: 'Stripe account information is required.' })
    @Matches(/^acct_[a-zA-Z0-9]{16}$/, {
        message: 'Invalid Stripe account format. It should start with "acct_" followed by 16 alphanumeric characters.'
    })
    payment_account_details: string;
}