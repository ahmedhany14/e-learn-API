import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entity/instructor.entity';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './services/instructor.service';
import { InstructorRepository } from './repository/instructor.repository';
import { CoursesModule } from 'src/courses/courses.module';
import { AdminModule } from 'src/admin/admin.module';
import { InstructorManageSectionsController } from './controllers/instructor.manage.sections.controller';
import { InstructorManageCoursesController } from './controllers/instructor.manage.courses.controller';
import { InstructorManageVideosController } from './controllers/instructor.manage.videos.controller';
import { InstructorManageReOrderingController } from './controllers/instructor.manage.re-ordering.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), CoursesModule, AdminModule],
  controllers: [InstructorController, InstructorManageSectionsController, InstructorManageCoursesController, InstructorManageVideosController, InstructorManageReOrderingController],
  providers: [InstructorService, InstructorRepository],
})
export class InstructorModule {}
