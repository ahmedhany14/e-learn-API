import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('courses')
export class CoursesController {
  @Get('all-courses')
  async getAllCourses() {
    /*
    not implemented yet
     */
    return 'All Courses';
  }

  @Get('course/:id')
  async getCourses() {
    /*
    not implemented yet
     */
    return 'Course';
  }

  @Post('course')
  async createCourse() {
    /*
    not implemented yet
     */
    return 'Course created';
  }

  @Patch('course/:id')
  async updateCourse() {}

  @Delete('course/:id')
  async deleteCourse() {
    /*
    not implemented yet
     */
    return 'Course deleted';
  }
}
