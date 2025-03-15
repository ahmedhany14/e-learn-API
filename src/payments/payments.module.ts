import { Module, forwardRef } from '@nestjs/common';
import { StripeModule } from './modules/stripe/stripe.module';
import { EnrollCoursesModule } from './modules/enroll-courses/enroll-courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsHistory } from './entities/payments.history.entity';

import { PaymentsService } from './payments.service';
import { PaymentsRepositoyService } from './payments.repositoy.service';
import { CoursesModule } from 'src/courses/courses.module';
import { ChargebackMonitorService } from './schedulers/chargeback-monitor.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentsHistory]),
        StripeModule,
        forwardRef(() => EnrollCoursesModule),
        CoursesModule,
    ],
    providers: [PaymentsService, PaymentsRepositoyService, ChargebackMonitorService],
    exports: [PaymentsService],
})
export class PaymentsModule {}
