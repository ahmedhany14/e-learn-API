import { IsString, IsCreditCard, Length, Matches, IsISO31661Alpha2, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class ViasPaymentDataDto {
    @IsISO31661Alpha2({ message: 'Country must be a valid ISO 3166-1 alpha-2 country code' })
    country: string;

    @IsString()
    @IsNotEmpty()

    paymentMethodId: string;

    @IsEnum(['visa', 'mastercard', 'paypal', 'stripe'], { message: 'Payment method must be one of: visa, mastercard, paypal, stripe' })
    @IsNotEmpty()
    payment_method: string;

    @IsCreditCard()
    @IsOptional()
    visa_card_number?: string;

    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Card holder name must contain only letters and spaces' })
    @IsOptional()
    visa_card_holder_name?: string;

    @IsString()
    @Matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Expiration date must be in MM/YY format' })
    @IsOptional()
    visa_card_expiration_date?: string;

    @IsString()
    @Length(3, 4, { message: 'CVC must be 3 or 4 digits' })
    @Matches(/^\d+$/, { message: 'CVC must contain only numbers' })
    @IsOptional()
    visa_card_cvc?: string;
}
