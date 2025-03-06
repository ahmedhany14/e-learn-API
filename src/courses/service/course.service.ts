import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { CourseRepo } from '../repository/course.repo';

// dto
import { QueryDto } from 'src/instructor/dtos/my.courses.query.dto';
import { UpdateCourseDto } from 'src/instructor/dtos/update.course.dto';
import { AddCourseSectionsDto } from 'src/instructor/dtos/add.course.sections.dto';

@Injectable()
export class CourseService {
  constructor(
    @Inject()
    private readonly courserRepo: CourseRepo,
  ) {}

  async createCourse(account_id: number) {
    return await this.courserRepo.createCourse(account_id);
  }

  async getCourse(id: string) {
    return await this.courserRepo.getCourse(id);
  }

  async updateImageName(course_id: number, image_name: string) {
    return await this.courserRepo.updateImageName(course_id, image_name);
  }

  async getMyCourses(filter: any, queryDto: QueryDto) {
    return await this.courserRepo.getMyCourses(filter, queryDto);
  }

  async updateCourseData(
    course_id: string,
    updateCourseDto: UpdateCourseDto
  ) {
    return await this.courserRepo.updateCourseData(
      course_id,
      updateCourseDto
    );
  }

  async addSections(
    course_id: string,
    addCourseSectionsDto: AddCourseSectionsDto
  ) {
    return await this.courserRepo.addSections(
      course_id,
      addCourseSectionsDto
    );
  }
}
