import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

// services
import { CourseService } from 'src/courses/service/course.service';
import { SectionsInstructorService } from 'src/sections/services/instructor/sections.instructor.service';
import { VideosInstructorService } from 'src/videos/services/instructor/videos.instructor.service';

@Injectable()
export class IsYourVideoGuard implements CanActivate {
    constructor(
        private readonly videosService: VideosInstructorService,
        private readonly sectionsService: SectionsInstructorService,
        private readonly courseService: CourseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const instructor_id: number = request.accountId;
        const video_id = parseInt(request.params.video_id);
        return this.checkIfVideoBelongsToInstructor(video_id, instructor_id, request);
    }

    async checkIfVideoBelongsToInstructor(
        video_id: number,
        instructor_id: number,
        request,
    ): Promise<boolean> {
        const video = await this.videosService.findOne({ id: video_id });

        if (!video) {
            throw new NotFoundException({
                message: `Video with id: ${video_id} not found`,
            });
        }

        const section = await this.sectionsService.findOne({
            id: video.section.id,
        });
        if (!section) {
            throw new NotFoundException({
                message: `Section with id: ${video.section.id} not found`,
            });
        }
        const course = await this.courseService.findOne({
            id: section.course.id,
        });

        if (course.instructor.id !== instructor_id) {
            throw new UnauthorizedException({
                message: 'You are not allowed to perform this action',
            });
        }
        request.course_id = course.id;
        request.section_id = section.id;
        return true;
    }
}
