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

export interface PlanPaymentMetadataI {
    account_id: string;
    plan_id: string;

    purchase_type: string;
    purchase_platform: string;

    enrollment_date: string;
    price_paid: string;

    payment_method_type: string;
    country?: string;
    transaction_reference?: string;
}
