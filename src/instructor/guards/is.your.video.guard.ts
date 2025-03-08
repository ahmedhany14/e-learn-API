import { CanActivate, ExecutionContext, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CourseService } from 'src/courses/service/course.service';
import { SectionsService } from 'src/courses/service/sections.service';
import { VideosService } from 'src/courses/service/videos.service';
import { VideoEnum, VideoRelations } from '../../courses/entities/enums/videos.enums';
import { SectionEnum, SectionRelations } from 'src/courses/entities/enums/sections.enums';
import { CourseEnum, CourseRelations } from 'src/courses/entities/enums/course.enums';

@Injectable()
export class IsYourVideoGuard implements CanActivate {
    private readonly logger = new Logger(IsYourVideoGuard.name);

    constructor(
        private readonly videosService: VideosService,
        private readonly sectionsService: SectionsService,
        private readonly courseService: CourseService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const instructor_id: number = request.accountId;
        const video_id = parseInt(request.params.video_id);

        const video_select: VideoEnum[] = [VideoEnum.ID];
        const video_relations: VideoRelations[] = [VideoRelations.SECTION];

        const video = await this.videosService.findOneById(video_select, video_relations, video_id);

        
        if (!video) {
            throw new NotFoundException({
                message: `Video with id: ${video_id} not found`,
            });
        }

        const section_select: SectionEnum[] = [SectionEnum.ID];
        const section_relations: SectionRelations[] = [SectionRelations.COURSE];

        const section = await this.sectionsService.findSectionById(
            section_select,
            section_relations,
            video.section.id
        );

        if (!section) {
            throw new NotFoundException({
                message: `Section with id: ${video.section.id} not found`,
            });
        };


        const course_select: CourseEnum[] = [CourseEnum.ID];
        const course_relations: CourseRelations[] = [CourseRelations.INSTRUCTOR];

        const course = await this.courseService.getCourse(course_select, course_relations, section.course.id);

        console.log(course.instructor.id);
        console.log(instructor_id);        

        request.course_id = course.id;
        request.section_id = section.id;
        if (course.instructor.id !== instructor_id) {
            throw new UnauthorizedException({
                message: 'You are not allowed to perform this action',
            })
        }
        return true;
    }
}
