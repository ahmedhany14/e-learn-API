import { Module } from '@nestjs/common';

// orm and entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/courses.entity';
import { Videos } from './entity/videos.entity';
import { CoursesController } from './courses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Videos])],
  controllers: [CoursesController],
})
export class CoursesModule {}
