import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// orm and entity
/*
import { Course, CourseDocument } from '../entities/course.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
*/
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../entities copy/course.entity';
// dto
import { QueryDto } from 'src/instructor/dtos/my.courses.query.dto';
import { UpdateCourseDto } from 'src/instructor/dtos/update.course.dto';
import { SectionDocument } from '../entities/sections.entity';

// services

@Injectable()
export class CourseRepo {
  private readonly logger = new Logger(CourseRepo.name);

  constructor(

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

  ) { }

  async createCourse(account_id: number): Promise<Course> {
    try {
      const course = this.courseRepository.create({
        instructor: { id: account_id },
      });

      return await this.courseRepository.save(course);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while creating course',
        details: error.message,
      });
    }
  }

  async findOneById(id: number): Promise<Course> {
    try {
      return await this.courseRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Error while fetching course',
        details: error.message,
      });
    }
  }

  async updateImageName(course_id: number, image_name: string): Promise<string> {
    try {
      const course = await this.courseRepository.findOne({
        where: { id: course_id },
      });

      course.image_url = image_name;

      await this.courseRepository.save(course);
      return image_name;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while updating image name',
        details: error.message,
      });
    }
  }

  async getMyCourses(filter: any, queryDto: QueryDto) {
    const data = await this.courseRepository.find({
      where: filter,
      skip: ((queryDto.page ?? 1) - 1) * queryDto.limit,
      take: queryDto.limit,
      relations: ['sections'],
    });


    const totalCourses = await this.courseRepository.count({
      where: filter,
    });

    const totalPages = Math.ceil((totalCourses * 1.0) / queryDto.limit);
    const hasMore = queryDto.page < totalPages;

    return {
      response: data,
      meta: {
        total: totalCourses,
        page: queryDto.page,
        limit: queryDto.limit,
        totalPages,
        hasMore,
        firstPage: `?page=1&limit=${queryDto.limit}`,
        lastPage: `?page=${totalPages}&limit=${queryDto.limit}`,
        previous:
          queryDto.page > 1
            ? `?page=${queryDto.page - 1}&limit=${queryDto.limit}`
            : null,
        next: hasMore
          ? `?page=${queryDto.page + 1}&limit=${queryDto.limit}`
          : null,
        current: `?page=${queryDto.page}&limit=${queryDto.limit}`,
      },
    };
  }

  async updateCourseData(course_id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      let course = await this.courseRepository.findOne({
        where: { id: course_id },
      });
      course =
      {
        ...course,
        ...updateCourseDto
      }
      return await this.courseRepository.save(course);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while updating course data',
      );
    }
  }
  /*
  async addSectionsToCourse(
    course_id: string,
    section: SectionDocument,
  ): Promise<CourseDocument> {
    try {
      return await this.coursesModel.findByIdAndUpdate(course_id, {
        $push: {
          course_sections: section,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while adding sections to course',
      );
    }
  }

  async removeSectionFromCourse(course_id: string, section_id: string) {
    try {
      return await this.coursesModel.findByIdAndUpdate(course_id, {
        $pull: {
          course_sections: section_id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error while removing section from course',
      );
    }
  }*/
}
