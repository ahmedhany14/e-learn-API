import { Controller, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';

import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

// guards
import { IsEnrolledGuard } from '../guards/is.enrolled.guard';
import { InYourPlanGuard } from '../guards/in.your.plan.guard';

// services
import { CourseService } from '../service/course.service';

// decorators
import { ExtractAccountData } from '@app/decorators';


interface RequestI extends Request {
    isInYourPlan: boolean;
    isEnrolled: boolean;
}

@Controller('courses')
export class CoursesController {

    constructor(
        @Inject()
        private readonly CourseService: CourseService,
    ) { }

    @UseGuards(IsEnrolledGuard, InYourPlanGuard)
    @AUTH(AuthEnum.BEARER)
    @Get(':id')
    async getCourseById(
        @Req() request: RequestI,
        @Param('id') id: number,
    ) {

        const course = await this.CourseService.findOne({ id });

        let sections = null, videos = null;
        if (request.isInYourPlan || request.isEnrolled) {
            sections = await course.sections;
            for (const section of sections) videos = await section.videos;
        }

        return {
            response: {
                IsEnrolled: request.isEnrolled || request.isInYourPlan,
                course,
                sections,
                videos,
            }
        }
    }
}