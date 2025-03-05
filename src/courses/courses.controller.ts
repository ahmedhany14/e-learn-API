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

    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Post('new-course')
    async createCourse(@ExtractAccountData('id') account_id: number) {
        /*
            API Endpoint to create a new course
            Steps:
                1) get the instructor id from request
                2) create a new course using the instructor id
                3) return a success message
        */

        const course = await this.courseService.createCourse(account_id);

        return {
            response: {
                message: 'Course created successfully',
                course,
            },
        };
    }

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
