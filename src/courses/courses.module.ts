import { forwardRef, Module } from '@nestjs/common';

// controllers
import { CoursesController } from './controllers/courses.controller';
import { CoursesViaInstructorController } from './controllers/courses.via.instructor.controller';

// providers and services
import { CourseService } from './service/course.service';
import { CourseRepo } from './repository/course.repo';
import { CourseCommitsModule } from 'src/administration/course_commits/course_commits.module';

// entities and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { EnrollCoursesModule } from 'src/payments/modules/enroll-courses/enroll-courses.module';
import { SubscriptionsModule } from 'src/payments/modules/subscriptions/subscriptions.module';
import { PlansModule } from 'src/plans/plans.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Course]),
        CourseCommitsModule,
        forwardRef(() => EnrollCoursesModule),
        forwardRef(() => PlansModule),
        SubscriptionsModule,
    ],
    controllers: [CoursesController, CoursesViaInstructorController],
    providers: [CourseService, CourseRepo],
    exports: [CourseService, CourseRepo],
})
export class CoursesModule { }
