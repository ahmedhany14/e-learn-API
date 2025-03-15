import { Inject, Injectable } from '@nestjs/common';
import { PaymentsRepositoyService } from './payments.repositoy.service';

@Injectable()
export class PaymentsService {

    constructor(
        @Inject()
        private readonly paymentsRepositoyService: PaymentsRepositoyService
    ) { }

    createPaymentHistory(data: any, account_id: number) {
        return this.paymentsRepositoyService.createPaymentHistory(data, account_id);
    }

}
