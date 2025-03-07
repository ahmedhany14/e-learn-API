import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CourseService } from 'src/courses/service/course.service';
import * as request from 'supertest';

@Injectable()
export class IsYourCourseGuard implements CanActivate {
  constructor(private readonly courseService: CourseService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const instructor_id: number = request.accountId;
    const course_id: number = parseInt(request.params.course_id);

    console.log('course_id', course_id);
    const course = await this.courseService.getCourse(course_id);

    if (!course)
      throw new NotFoundException(
        `Course with ID ${course_id} does not exist.`,
      );

    if (course.instructor.id !== instructor_id)
      throw new ForbiddenException(
        `You are not authorized to access this resource`,
      );

    if (course.state !== 'draft') {
      throw new ConflictException({
        message: 'Course is not in draft',
        details: `Course with id: ${course_id} is not in draft state, you can only update courses in draft state`,
      });
    }
    request.course = course;
    return true;
  }
}
