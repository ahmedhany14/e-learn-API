export interface PaymentMetadataI {
    course_id: string;
    account_id: string;

    purchase_type: string;
    purchase_platform: string;

    enrollment_date: string;
    price_paid: string;

    payment_method_type: string;
    country?: string;
    transaction_reference?: string;
}
