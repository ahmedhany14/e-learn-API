// modules
import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';

import { InstructorController } from './instructor.controller';

// entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entity/instructor.entity';

// services
import { InstructorService } from './services/instructor.service';
import { InstructorRepository } from './repository/instructor.repository';
import { SectionsModule } from '../sections/sections.module';
import { VideosModule } from '../videos/videos.module';
import { KeyGeneratorModule } from 'src/common/key.generator/key.generator.module';
import { ReviewCoursesModule } from '../administration/review-courses/review-courses.module';

@Module({
    imports: [TypeOrmModule.forFeature([Instructor]), CoursesModule, ReviewCoursesModule],
    controllers: [InstructorController],
    providers: [InstructorService, InstructorRepository],
})
export class InstructorModule {}
