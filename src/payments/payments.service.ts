import { Inject, Injectable } from '@nestjs/common';
import { PaymentsRepositoryService } from './payments.repositoy.service';
import { PaymentHistoryI } from './interfaces/payment.history.interface';

@Injectable()
export class PaymentsService {
    constructor(
        @Inject()
        private readonly paymentsRepositoryService: PaymentsRepositoryService,
    ) {}

    createPaymentHistory(data: PaymentHistoryI, account_id: number) {
        return this.paymentsRepositoryService.createPaymentHistory(data, account_id);
    }
}
