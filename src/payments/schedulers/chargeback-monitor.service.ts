import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ChargebackMonitorService {
    private readonly logger = new Logger(ChargebackMonitorService.name);

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async monitorPayments() {
        this.logger.debug('Chargeback monitor service is being executed...');
        /*
        Will implement the logic to check for chargebacks and update the payment status
         */
    }
}
