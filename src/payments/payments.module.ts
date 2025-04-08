import { Module, forwardRef } from '@nestjs/common';
import { StripeModule } from './modules/stripe/stripe.module';
import { EnrollCoursesModule } from './modules/enroll-courses/enroll-courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsHistory } from './entities/payments.history.entity';

import { PaymentsService } from './payments.service';
import { PaymentsRepositoryService } from './payments.repositoy.service';
import { ChargebackMonitorService } from './schedulers/chargeback-monitor.service';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentsHistory]),
        StripeModule,
        forwardRef(() => EnrollCoursesModule),
        SubscriptionsModule,
    ],
    providers: [PaymentsService, PaymentsRepositoryService, ChargebackMonitorService],
    exports: [PaymentsService],
})
export class PaymentsModule { }
