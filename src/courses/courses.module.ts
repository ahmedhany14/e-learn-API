import { Module } from '@nestjs/common';

// orm and entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/courses.entity';
import { Videos } from './entity/videos.entity';

// controllers
import { CoursesController } from './courses.controller';

// providers and services
import { CourseService } from './service/course.service';
import { CourseRepo } from './repository/course.repo';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Videos]), PaginationModule],
  controllers: [CoursesController],
  providers: [CourseService, CourseRepo],
  exports: [CourseService],
})
export class CoursesModule {}
