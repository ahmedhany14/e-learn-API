import { Module } from '@nestjs/common';

// orm and entities
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';
import { CourseVideos, CourseVideosSchema } from './entities/course.videos.entity';
// controllers
import { CoursesController } from './courses.controller';

// providers and services
import { CourseService } from './service/course.service';
import { CourseRepo } from './repository/course.repo';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: CourseVideos.name,
        schema: CourseVideosSchema,
      },
    ])

    , PaginationModule],
  controllers: [CoursesController],
  providers: [CourseService, CourseRepo],
  exports: [CourseService],
})
export class CoursesModule { }
