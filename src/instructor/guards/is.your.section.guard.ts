import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { SectionsService } from '../../courses/service/sections.service';
import { CourseService } from '../../courses/service/course.service';

@Injectable()
export class IsYourSectionGuard implements CanActivate {
  constructor(
    private readonly sectionsService: SectionsService,
    private readonly courseService: CourseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const section_id = request.params.section_id;
    const instructor_id = request.accountId;

    const section = await this.sectionsService.findSectionById(section_id);

    if (!section) {
      throw new NotFoundException({
        message: 'Section not found',
        details: `Section with id ${section_id} not found`,
      });
    }

    const course = await this.courseService.getCourse(section.course_id);

    if (!course) {
      throw new NotFoundException({
        message: 'Course not found',
        details: `Course with id ${section.course_id} not found`,
      });
    }

    if (course.instructor !== instructor_id) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        details: `You are not authorized to access this section`,
      });
    }

    return true;
  }
}
