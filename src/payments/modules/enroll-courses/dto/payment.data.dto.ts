import { IsString, IsISO31661Alpha2, IsNotEmpty, IsEnum } from 'class-validator';

export class VisaPaymentDataDto {
    @IsISO31661Alpha2({ message: 'Country must be a valid ISO 3166-1 alpha-2 country code' })
    country: string;

    @IsString()
    @IsNotEmpty()
    paymentMethodId: string;

    @IsEnum(['visa', 'mastercard', 'paypal', 'stripe'], {
        message: 'Payment method must be one of: visa, mastercard, paypal, stripe',
    })
    @IsNotEmpty()
    payment_method: string;
}
