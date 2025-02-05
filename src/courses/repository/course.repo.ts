// orm and entity
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entity/courses.entity';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class CourseRepo {
  private readonly logger = new Logger(CourseRepo.name);

  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async getCourse(id: number) {
    try {
      return await this.courseRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while fetching course');
    }
  }

  async updateImageName(course_id: number, image_name: string) {
    try {
      await this.courseRepository.update(
        { id: course_id },
        { image_url: image_name },
      );
      return image_name;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while updating course image',
      );
    }
  }
}
