import { Module } from '@nestjs/common';

// controllers
import { CoursesViaInstructorController } from './controllers/courses.via.instructor.controller';

// providers and services
import { CourseService } from './service/course.service';
import { CourseRepo } from './repository/course.repo';
import { PaginationModule } from 'src/common/pagination/pagination.module';

// entities and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course]), PaginationModule],
    controllers: [CoursesViaInstructorController],
    providers: [CourseService, CourseRepo],
    exports: [CourseService],
})
export class CoursesModule { }
