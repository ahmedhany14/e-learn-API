import { Controller, Get, Query } from '@nestjs/common';

@Controller('admin-dashboard')
export class AdminSiteAnalysisController {

    constructor() {

    }

    // total active, de-activated, banned, ...etc students
    @Get('total-students')
    async getTotalStudents(
        @Query('type') type: any
    ) {
        // fetch total students from the database with role = student

        return {
            total: 0
        };
    }

    // total active, de-activated, banned, ...etc instructors
    @Get('total-instructors')
    async getTotalInstructors(
        @Query('type') type: any
    ) {
        // fetch total instructors from the database with role = instructor

        return {
            total: 0
        };
    }

    // total published, pending, draft, ...etc courses
    @Get('total-courses')
    async getTotalCourses(
        @Query('type') type: any
    ) {
        // fetch total courses from the database

        return {
            total: 0
        };
    }

    // total blogs

    /*
    pagination (n) for the following:
    * top (n) enrolled courses
    * top (n) instructors with the most courses
    * top (n) instructors with the most students
    * top (n) rated courses
    * top (n) rated instructors
    * top (n) upvoted blogs
    * top (n) commented blogs
    * top (n) blog authors
    */

}
