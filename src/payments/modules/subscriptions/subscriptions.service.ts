import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSubscribe } from './transactions/create.subscribe';
import { CancelSubscribe } from './transactions/cancel.subscribe';
import { VisaPaymentDataDto } from '../enroll-courses/dto/payment.data.dto';
import { AbstractRepoService } from '@app/abstract.db';
import { AccountSubscriptions } from './entity/account.plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

@Injectable()
export class SubscriptionsService extends AbstractRepoService<AccountSubscriptions> {
    protected readonly logger = new Logger(SubscriptionsService.name);

    constructor(
        @InjectRepository(AccountSubscriptions)
        private readonly accountSubscriptionsRepo: Repository<AccountSubscriptions>,
        entityManager: EntityManager,

        @Inject()
        private readonly createSubscribe: CreateSubscribe,
        @Inject()
        private readonly cancelSubscribe: CancelSubscribe,
    ) {
        super(accountSubscriptionsRepo, entityManager);
    }

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

    async processCancelSubscription() { }
}
