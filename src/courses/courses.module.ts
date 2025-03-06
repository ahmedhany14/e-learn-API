import { Module } from '@nestjs/common';

// orm and entities
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';
import { Section, SectionSchema } from './entities/sections.entity';
import { Videos, VideosSchema } from './entities/videos.entity';
// controllers
import { CoursesController } from './courses.controller';

// providers and services
import { CourseService } from './service/course.service';
import { CourseRepo } from './repository/course.repo';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { SectionsService } from './service/sections.service';
import { SectionsRepo } from './repository/sections.repo';
import { VideosService } from './service/videos.service';
import { VideosRepo } from './repository/videos.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: Section.name,
        schema: SectionSchema,
      },
      {
        name: Videos.name,
        schema: VideosSchema,
      },
    ]),
    PaginationModule,
  ],
  controllers: [CoursesController],
  providers: [
    CourseService,
    CourseRepo,
    SectionsService,
    SectionsRepo,
    VideosService,
    VideosRepo,
  ],
  exports: [CourseService, SectionsService, VideosService],
})
export class CoursesModule {}
