import {
    CanActivate,
    ConflictException,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CourseService } from 'src/courses/service/course.service';
import { CourseStatusEnum } from '../enums/course.status.enum';

@Injectable()
export class CanCommitChangesGuard implements CanActivate {
    constructor(private readonly courseService: CourseService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const instructor_id: number = request.accountId;
        const course_id: number = parseInt(request.params.course_id);

        const course = await this.courseService.findOne({ id: course_id });

        if (!course) throw new NotFoundException(`Course with ID ${course_id} does not exist.`);

        if (course.instructor.id !== instructor_id)
            throw new ForbiddenException(`You are not authorized to access this resource`);

        if (course.state !== CourseStatusEnum.PUBLISHED) {
            throw new ConflictException({
                message: 'Course is not published',
                details: `Course with id: ${course_id} is not in published state, you can only update courses in published state`,
            });
        }
        return true;
    }
}
