import { Inject, Injectable } from '@nestjs/common';
import { CreateSubscribe } from './transactions/create.subscribe';
import { CancelSubscribe } from './transactions/cancel.subscribe';
import { VisaPaymentDataDto } from '../enroll-courses/dto/payment.data.dto';

@Injectable()
export class SubscriptionsService {
    constructor(
        @Inject()
        private readonly createSubscribe: CreateSubscribe,
        @Inject()
        private readonly cancelSubscribe: CancelSubscribe,
    ) {}

    async processCreateSubscription(
        plan_id: number,
        account_id: number,
        visaPaymentDataDto: VisaPaymentDataDto,
    ) {
        return this.createSubscribe.processCreateSubscription(
            plan_id,
            account_id,
            visaPaymentDataDto,
        );
    }

    async processCancelSubscription() {}
}
