export interface PaymentHistoryI {
    amount?: number;
    country?: string;
    currency?: string;
    failed_reason?: string;
    status: string;
    payment_method: string;
}
