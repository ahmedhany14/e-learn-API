import { Module } from '@nestjs/common';
import { CoursesModule } from '../courses/courses.module';

// controllers
import { SectionsViaInstructorController } from './controllers/sections.via.instructor.controller';

// entities
import { Section } from './entity/sections.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

// services and repository
import { SectionsInstructorService } from './services/instructor/sections.instructor.service';
import { SectionsInstructorRepo } from './repository/instructor/sections.instructor.repo';

@Module({
    imports: [TypeOrmModule.forFeature([Section]), CoursesModule],
    providers: [SectionsInstructorService, SectionsInstructorRepo],
    exports: [SectionsInstructorService],
    controllers: [SectionsViaInstructorController],
})
export class SectionsModule {}
