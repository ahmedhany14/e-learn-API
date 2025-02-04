import { Module } from '@nestjs/common';

// orm and entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/courses.entity';
import { Videos } from './entity/videos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Videos])],
})
export class CoursesModule {}
