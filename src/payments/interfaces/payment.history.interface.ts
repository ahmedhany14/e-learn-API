export interface PaymentHistoryI {
    amount?: number;
    country?: string;
    currency?: string;
    status: string;
    payment_method: string;
}
