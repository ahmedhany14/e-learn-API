import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CourseService } from 'src/courses/service/course.service';
import { SectionsService } from 'src/courses/service/sections.service';
import { VideosService } from 'src/courses/service/videos.service';

@Injectable()
export class IsYourVideoGuard implements CanActivate {

    constructor(
        private readonly videosService: VideosService,
        private readonly sectionsService: SectionsService,
        private readonly courseService: CourseService,
    ) {

    }


    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const instructor_id = request.accoutId;
        const course_id = request.params.course_id, section_id = request.params.section_id, video_id = request.params.video_id;

        /*
            Logic here, will be implemented later
        */
        return true;
    }
}
