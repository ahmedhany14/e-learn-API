import { Module, forwardRef } from '@nestjs/common';
import { StripeModule } from './stripe/stripe.module';
import { EnrollCoursesModule } from './enroll-courses/enroll-courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsHistory } from './entities/payments.history.entity';

import { FacadePatternProcessPaymentsService } from './patterns/facade.pattern.process.payments.service';
import { PaymentsService } from './payments.service';
import { PaymentsRepositoyService } from './payments.repositoy.service';
import { CoursesModule } from 'src/courses/courses.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PaymentsHistory
        ]),
        StripeModule,
        forwardRef(() => EnrollCoursesModule),
        CoursesModule
    ],
    providers: [FacadePatternProcessPaymentsService, PaymentsService, PaymentsRepositoyService],
    exports: [FacadePatternProcessPaymentsService]
})
export class PaymentsModule { }
