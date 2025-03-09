import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entity/sections.entity';

// services and repository
import { SectionsInstructorService } from './services/instructor/sections.instructor.service';
import { SectionsInstructorRepo } from './repository/instructor/sections.instructor.repo';

@Module({
    imports: [TypeOrmModule.forFeature([Section])],
    providers: [SectionsInstructorService, SectionsInstructorRepo],
    exports: [SectionsInstructorService],
})
export class SectionsModule { }
