import { Module } from '@nestjs/common';

// orm and entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/courses.entity';
// import { Video } from './entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
})
export class CoursesModule {}
