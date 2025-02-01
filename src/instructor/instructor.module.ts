import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entity/instructor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instructor]),
  ]

})
export class InstructorModule {}
