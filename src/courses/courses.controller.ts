import { Controller, Delete, Get, Post } from '@nestjs/common';

// decorators for auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

// decorators
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

// dto
// services
import { CourseService } from './service/course.service';

@Controller('courses')
export class CoursesController {
    constructor(private courseService: CourseService) { }

    @Get('all-instructor-courses/:instructor_id')
    async getAllCourses() {
        /*
        not implemented yet
         */
        return 'All Courses';
    }

    @Get('course/:id')
    async getCourses() {
        /*
            not implemented yet
        */
        return 'Course';
    }

    @Delete('course/:id')
    async deleteCourse() {
        /*
            not implemented yet
        */
        return 'Course deleted';
    }
}
