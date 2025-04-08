import {
    CanActivate,
    ConflictException,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

// services
import { SectionsInstructorService } from '../services/instructor/sections.instructor.service';
import { CourseService } from '../../courses/service/course.service';

// entities
import { CourseStatusEnum } from '../../courses/enums/course.status.enum';

@Injectable()
export class IsYourSectionGuard implements CanActivate {
    constructor(
        private readonly sectionsService: SectionsInstructorService,
        private readonly courseService: CourseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const section_id: number = parseInt(request.params.section_id);
        const instructor_id: number = request.accountId;

        return this.checkIfSectionBelongsToInstructor(section_id, instructor_id);
    }

    async checkIfSectionBelongsToInstructor(
        section_id: number,
        instructor_id: number,
    ): Promise<boolean> {
        const section = await this.sectionsService.findOne({
            id: section_id,
        });

        if (!section) {
            throw new NotFoundException({
                message: 'Section not found',
                details: `Section with id ${section_id} not found`,
            });
        }

        const course = await this.courseService.findOne({ id: section.course.id });

        if (course.instructor.id !== instructor_id) {
            throw new UnauthorizedException({
                message: 'Unauthorized',
                details: `You are not authorized to access this section`,
            });
        }

        if (course.state !== CourseStatusEnum.DRAFT) {
            throw new ConflictException({
                message: 'Conflict',
                details: `You can only add videos to draft courses`,
            });
        }
        return true;
    }
}
