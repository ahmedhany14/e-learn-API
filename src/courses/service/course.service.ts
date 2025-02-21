import { Inject, Injectable } from '@nestjs/common';
import { CourseRepo } from '../repository/course.repo';

@Injectable()
export class CourseService {
  constructor(
    @Inject()
    private readonly courserRepo: CourseRepo,
  ) {}

  async createCourse(createCourseDto: any, account_id: number) {
    return await this.courserRepo.createCourse(createCourseDto, account_id);
  }

  async getCourse(id: number) {
    return await this.courserRepo.getCourse(id);
  }

  async updateImageName(course_id: number, image_name: string) {
    return await this.courserRepo.updateImageName(course_id, image_name);
  }

}
