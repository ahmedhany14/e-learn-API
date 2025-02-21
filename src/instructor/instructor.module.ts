import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entity/instructor.entity';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './services/instructor.service';
import { InstructorRepository } from './repository/instructor.repository';
import { CoursesModule } from 'src/courses/courses.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [TypeOrmModule.forFeature([Instructor]), CoursesModule, AdminModule],
  controllers: [InstructorController],
  providers: [InstructorService, InstructorRepository],
})
export class InstructorModule {}
