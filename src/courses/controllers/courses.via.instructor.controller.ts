import {
    Body,
    Controller,
    Get,
    Inject,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

// auth and role decorators
import { AUTH } from '../../auth/decorators/auth.decorator';
import { ROLE } from '../../auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { RoleEnum } from 'src/auth/enums/role.enum';

// decorators
import { ExtractAccountData } from 'src/common/decorators/request.extractData.decorator';

// services and providers
import { CourseService } from 'src/courses/service/course.service';

// dto and types
import { QueryDto } from '../dtos/my.courses.query.dto';
import { UpdateCourseDto } from '../dtos/update.course.dto';

// guards
import { IsYourCourseGuard } from '../guards/is.your.course.guard';
import { CommitedChangesDto } from '../dtos/commited.changes.dto';
import { CanCommitChangesGuard } from '../guards/can.commit.changes.guard';

@Controller('courses-via-instructor')
export class CoursesViaInstructorController {
    private readonly logger = new Logger(CoursesViaInstructorController.name);

    constructor(
        @Inject()
        private readonly courseService: CourseService,
    ) { }

    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Post('new-course')
    async createCourse(@ExtractAccountData('id') account_id: number) {
        this.logger.log(`Creating a new course for the instructor account_id: ${account_id}`);

        const course = await this.courseService.createCourse(account_id);

        return {
            response: {
                message: 'Course created successfully',
                course,
            },
        };
    }

    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Get('my-courses')
    async getMyCourses(@Query() queryDto: QueryDto, @ExtractAccountData('id') account_id: number) {
        this.logger.log(`Getting courses for the instructor account_id: ${account_id}`);

        const filter = {
            instructor: { id: account_id },
            state: queryDto.state,
        };

        const my_courses = await this.courseService.getMyCourses(filter, queryDto);

        return {
            response: {
                message: 'Courses fetched successfully',
                data: my_courses,
            },
        };
    }

    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Get('course/:course_id')
    async getCourse(@Param('course_id', ParseIntPipe) course_id: number) {
        this.logger.log(`Getting course with course_id: ${course_id}`);

        const course = await this.courseService.getCourse(course_id);

        return {
            response: {
                message: 'Course fetched successfully',
                data: course,
            },
        };
    }

    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('update-course-data/:course_id')
    async updateCourseData(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() updateCourseDataDto: UpdateCourseDto,
    ) {
        this.logger.log(`Updating course metadata for course_id: ${course_id}`);

        const course = await this.courseService.updateCourseData(course_id, updateCourseDataDto);

        return {
            response: {
                message: 'Course updated successfully',
                data: course,
            },
        };
    }

    /**
     * 
     * @param course_id 
     * @param commitedChangesDto 
     * @returns the course with the commited changes
     * @description this endpoint is used to commit the changes made to the course
     * @description the changes are made in the course_commits_review table
     */

    @UseGuards(CanCommitChangesGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('commit-changes/:course_id')
    async commitChanges(
        @Param('course_id', ParseIntPipe) course_id: number,
        @Body() commitedChangesDto: CommitedChangesDto,
    ) {
        this.logger.log(`Committing changes for course_id: ${course_id}`);

        if (Object.keys(commitedChangesDto).length !== 0)
            await this.courseService.commitChanges(course_id, commitedChangesDto);

        return {
            response: {
                message: 'Course changes committed successfully',
            },
        };
    }

}
