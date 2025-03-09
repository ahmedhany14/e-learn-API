// modules
import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';
import { AdminModule } from 'src/admin/admin.module';

// controllers
import { InstructorManageSectionsController } from './controllers/instructor.manage.sections.controller';
import { InstructorManageCoursesController } from './controllers/instructor.manage.courses.controller';
import { InstructorManageVideosController } from './controllers/instructor.manage.videos.controller';
import { InstructorController } from './instructor.controller';

// entities
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entity/instructor.entity';

// services
import { InstructorService } from './services/instructor.service';
import { InstructorRepository } from './repository/instructor.repository';


@Module({
    imports: [TypeOrmModule.forFeature([Instructor]), CoursesModule, AdminModule],
    controllers: [InstructorController, InstructorManageSectionsController, InstructorManageCoursesController, InstructorManageVideosController],
    providers: [InstructorService, InstructorRepository],
})
export class InstructorModule { }
