import { Module, forwardRef } from '@nestjs/common';
import { StripeModule } from './modules/stripe/stripe.module';
import { EnrollCoursesModule } from './modules/enroll-courses/enroll-courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsHistory } from './entities/payments.history.entity';

import { PaymentsService } from './payments.service';
import { PaymentsRepositoryService } from './payments.repositoy.service';
import { CoursesModule } from 'src/courses/courses.module';
import { ChargebackMonitorService } from './schedulers/chargeback-monitor.service';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentsHistory]),
        StripeModule,
        forwardRef(() => EnrollCoursesModule),
        CoursesModule,
        SubscriptionsModule,
    ],
    providers: [PaymentsService, PaymentsRepositoryService, ChargebackMonitorService],
    exports: [PaymentsService],
})
export class PaymentsModule {}
