import { Inject, Injectable } from '@nestjs/common';
import { CourseRepo } from '../repository/course.repo';
import { QueryDto } from 'src/instructor/dtos/my.courses.query.dto';

@Injectable()
export class CourseService {
  constructor(
    @Inject()
    private readonly courserRepo: CourseRepo,
  ) {}

  async createCourse(account_id: number) {
    return await this.courserRepo.createCourse(account_id);
  }

  async getCourse(id: number) {
    return await this.courserRepo.getCourse(id);
  }

  async updateImageName(course_id: number, image_name: string) {
    return await this.courserRepo.updateImageName(course_id, image_name);
  }

  async getMyCourses(filter: any, queryDto: QueryDto) {
    return await this.courserRepo.getMyCourses(filter, queryDto);
  }
}
