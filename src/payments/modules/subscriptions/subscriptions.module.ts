import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountSubscriptions } from './entity/account.plan.entity';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscribe } from './transactions/create.subscribe';
import { CancelSubscribe } from './transactions/cancel.subscribe';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentsModule } from '../../payments.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccountSubscriptions]),
        StripeModule,
        forwardRef(() => PaymentsModule),
    ],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, CreateSubscribe, CancelSubscribe],
})
export class SubscriptionsModule {}
