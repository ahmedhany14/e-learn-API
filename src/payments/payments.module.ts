import { Module } from '@nestjs/common';
import { StripeModule } from './stripe/stripe.module';
import { EnrollCoursesModule } from './enroll-courses/enroll-courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsHistory } from './entities/payments.history.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PaymentsHistory
        ]),
        StripeModule, EnrollCoursesModule],
})
export class PaymentsModule { }
