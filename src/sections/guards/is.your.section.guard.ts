import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

// services
import { SectionsInstructorService } from '../../sections/services/instructor/sections.instructor.service';
import { CourseService } from '../../courses/service/course.service';
// entities
import {
    SectionEnum,
    SectionRelations,
} from 'src/sections/entity/sections.enums';
import { CourseRelations } from 'src/courses/entities/course.enums';

@Injectable()
export class IsYourSectionGuard implements CanActivate {
    private readonly logger = new Logger(IsYourSectionGuard.name);

    constructor(
        private readonly sectionsService: SectionsInstructorService,
        private readonly courseService: CourseService,
    ) { }

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
        const select: SectionEnum[] = [SectionEnum.ID];

        const relations: SectionRelations[] = [SectionRelations.COURSE];

        const section = await this.sectionsService.findSectionById(
            select,
            relations,
            section_id,
        );

        if (!section) {
            throw new NotFoundException({
                message: 'Section not found',
                details: `Section with id ${section_id} not found`,
            });
        }

        const course = await this.courseService.getCourse(
            [],
            [CourseRelations.INSTRUCTOR],
            section.course.id,
        );

        if (course.instructor.id !== instructor_id) {
            throw new UnauthorizedException({
                message: 'Unauthorized',
                details: `You are not authorized to access this section`,
            });
        }

        return true;
    }
}
