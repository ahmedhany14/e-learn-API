import { forwardRef, Module } from '@nestjs/common';

// modules
import { StripeModule } from '../stripe/stripe.module';
import { PaymentsModule } from '../../payments.module';

// entities
import { EnrolledCourses } from './entity/enrolled.courses.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

// controllers
import { EnrollCoursesController } from './enroll-courses.controller';

// services
import { EnrollCoursesService } from './services/enroll-courses.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([EnrolledCourses]),
        StripeModule,
        forwardRef(() => PaymentsModule),
    ],
    controllers: [EnrollCoursesController],
    providers: [EnrollCoursesService],
    exports: [EnrollCoursesService],
})
export class EnrollCoursesModule { }
