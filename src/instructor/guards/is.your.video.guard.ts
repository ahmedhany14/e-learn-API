import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CourseService } from 'src/courses/service/course.service';
import { SectionsInstructorService } from 'src/sections/services/instructor/sections.instructor.service';
import { VideosInstructorService } from 'src/videos/services/instructor/videos.instructor.service';
import { VideoEnum, VideoRelations } from '../../videos/entity/videos.enums';
import {
  SectionEnum,
  SectionRelations,
} from 'src/sections/entity/sections.enums';
import { CourseEnum, CourseRelations } from 'src/courses/entities/course.enums';

@Injectable()
export class IsYourVideoGuard implements CanActivate {
  private readonly logger = new Logger(IsYourVideoGuard.name);

  constructor(
    private readonly videosService: VideosInstructorService,
    private readonly sectionsService: SectionsInstructorService,
    private readonly courseService: CourseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const instructor_id: number = request.accountId;
    const video_id = parseInt(request.params.video_id);
    return this.checkIfVideoBelongsToInstructor(
      video_id,
      instructor_id,
      request,
    );
  }

  async checkIfVideoBelongsToInstructor(
    video_id: number,
    instructor_id: number,
    request,
  ): Promise<boolean> {
    const video_select: VideoEnum[] = [VideoEnum.ID];
    const video_relations: VideoRelations[] = [VideoRelations.SECTION];

    const video = await this.videosService.findOneById(
      video_select,
      video_relations,
      video_id,
    );

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
      video.section.id,
    );

    if (!section) {
      throw new NotFoundException({
        message: `Section with id: ${video.section.id} not found`,
      });
    }
    const course_select: CourseEnum[] = [CourseEnum.ID];
    const course_relations: CourseRelations[] = [CourseRelations.INSTRUCTOR];

    const course = await this.courseService.getCourse(
      course_select,
      course_relations,
      section.course.id,
    );

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
