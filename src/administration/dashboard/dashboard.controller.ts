import { Controller, Get, Inject, Logger, Query } from '@nestjs/common';

// services
import { AccountService } from '../../account/service/account.service';
import { CourseService } from '../../courses/service/course.service';

// Auth and Role decorators
import { ROLE } from '../../auth/decorators/role.decorator';
import { RoleEnum } from '../../auth/enums/role.enum';
import { AUTH } from '../../auth/decorators/auth.decorator';
import { AuthEnum } from '../../auth/enums/auth.enum';

// pipes
import { TransformUserTypePipe } from './pipes/transform.user.type.pipe';
import { AccountTypeDto } from './dtos/account.type.dto';
import { CourseTypeDto } from './dtos/course.type.dtp';

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('admin/dashboard')
export class DashboardController {
    private readonly logger = new Logger(DashboardController.name);

    constructor(
        @Inject()
        private readonly accountService: AccountService,
        @Inject()
        private readonly courseService: CourseService,
    ) {}

    // total active, deactivated, banned, ...etc students
    @Get('total-students')
    async getTotalStudents(@Query(TransformUserTypePipe) filter: AccountTypeDto) {
        this.logger.log('Total students');

        const total = await this.accountService.getTotalStudents(filter);
        return {
            response: total,
        };
    }

    // total active, deactivated, banned, ...etc instructors
    @Get('total-instructors')
    async getTotalInstructors(@Query(TransformUserTypePipe) filter: {}) {
        this.logger.log('Total instructors');
        const total = await this.accountService.getTotalInstructors(filter);
        return {
            response: total,
        };
    }

    // total published, pending, draft, ...etc courses
    @Get('total-courses')
    async getTotalCourses(@Query() type: CourseTypeDto) {
        this.logger.log('Total courses');

        const filter = {
            state: type.type,
        };
        const total = await this.courseService.getTotalCourses(filter);

        return {
            response: total,
        };
    }

    // total blogs
    /*
     ********* Will be implemented in the future *********

     pagination (n) for the following:
     * top (n) enrolled courses
     * top (n) instructors with the most courses
     * top (n) instructors with the most students
     * top (n) rated courses
     * top (n) rated instructors
     * top (n) upvote blogs
     * top (n) commented blogs
     * top (n) blog authors
     */
}
