import { Controller, Get, Inject, Logger, UseGuards } from '@nestjs/common';

// Auth and role decorators
import { ROLE } from '../auth/decorators/role.decorator';
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { RoleEnum } from '../auth/enums/role.enum';

// decorators
import { ExtractAccountData } from '@app/decorators';

// services and providers
import { InstructorService } from './services/instructor.service';

// dto
import { IsYourCourseGuard } from '../courses/guards/is.your.course.guard';
import { ExtractCourseDate } from '@app/decorators';

@Controller('instructor')
export class InstructorController {
    private readonly logger = new Logger(InstructorController.name);

    constructor(
        @Inject()
        private readonly instructorService: InstructorService,
    ) {}

    @Get('push-course-to-review/:course_id')
    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    async pushCourseToBeReviewed(@ExtractCourseDate('id') course_id: number) {
        this.logger.log(`Pushing course with id: ${course_id} for review`);
        const review = await this.instructorService.pushCourseForReview(course_id);

        return {
            response: `Course with id: ${course_id} has been pushed for review, with review id: ${review.id}`,
        };
    }
}
