import { Module } from '@nestjs/common';

// controllers
import { CoursesController } from './courses.controller';

// providers and services
import { CourseService } from './service/course.service';
import { CourseRepo } from './repository/course.repo';
import { PaginationModule } from 'src/common/pagination/pagination.module';

// entities and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Section } from '../sections/entity/sections.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course, Section]), PaginationModule],
    controllers: [CoursesController],
    providers: [
        CourseService,
        CourseRepo,
    ],
    exports: [CourseService],
})
export class CoursesModule { }
