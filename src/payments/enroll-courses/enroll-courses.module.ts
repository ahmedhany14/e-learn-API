import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';
import { StripeModule } from '../stripe/stripe.module';
import { EnrollCoursesController } from './enroll-courses.controller';

@Module({
    imports: [
        CoursesModule,
        StripeModule
    ],
    controllers: [EnrollCoursesController],
})
export class EnrollCoursesModule { }
