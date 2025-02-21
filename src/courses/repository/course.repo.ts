// orm and entity
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entity/courses.entity';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCourseDto } from '../dto/create.course.dto';

@Injectable()
export class CourseRepo {
  private readonly logger = new Logger(CourseRepo.name);

  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto, account_id: number) {
    try {
      const course = this.courseRepository.create({
        image_url: createCourseDto.image_url ?? 'default.jpg',
        price: createCourseDto.price ?? 0,
        description: createCourseDto.description,
        requirements: createCourseDto.requirements,
        what_you_learn: createCourseDto.what_you_learn,
        instructor: { id: account_id },
        // plan: { plan_name: createCourseDto.plan ?? 'free' },
      });

      return await this.courseRepository.save(course);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error while creating course');
    }
  }

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
