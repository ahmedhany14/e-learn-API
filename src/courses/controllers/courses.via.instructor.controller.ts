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
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

// decorators
import { ExtractAccountData } from '@app/decorators';

// services and providers
import { CourseService } from 'src/courses/service/course.service';

// dto and types
import { QueryDto } from '../dtos/my.courses.query.dto';
import { UpdateCourseDto } from '../dtos/update.course.dto';

// guards
import { IsYourCourseGuard } from '../guards/is.your.course.guard';
import { CommitedChangesDto } from '../dtos/commited.changes.dto';
import { CanCommitChangesGuard } from '../guards/can.commit.changes.guard';

@Controller('courses/instructor')
export class CoursesViaInstructorController {
    private readonly logger = new Logger(CoursesViaInstructorController.name);

    constructor(
        @Inject()
        private readonly courseService: CourseService,
    ) {}

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

        const my_courses = await this.courseService.paginate(
            {
                instructor: { id: account_id },
                state: queryDto.state,
            },
            queryDto,
        );

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
    @Get('course/:id')
    async getCourse(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`Getting course with course_id: ${id}`);

        const course = await this.courseService.findOne({ id });

        return {
            response: {
                message: 'Course fetched successfully',
                data: course,
            },
        };
    }

    /**
     *
     * @param id course_id
     * @param updateCourseDataDto the data to update the course
     * @returns the updated course
     */

    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('update-course-data/:id')
    async updateCourseData(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCourseDataDto: UpdateCourseDto,
    ) {
        this.logger.log(`Updating course metadata for course_id: ${id}`);

        const course = await this.courseService.findOneAndUpdate({ id }, updateCourseDataDto);

        return {
            response: {
                message: 'Course updated successfully',
                data: course,
            },
        };
    }

    /**
     *
     * @param id
     * @param commitedChangesDto
     * @returns the course with the commited changes
     * @description this endpoint is used to commit the changes made to the course
     * @description the changes are made in the course_commits_review table
     */
    @UseGuards(CanCommitChangesGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Patch('commit-changes/:id')
    async commitChanges(
        @Param('id', ParseIntPipe) id: number,
        @Body() commitedChangesDto: CommitedChangesDto,
    ) {
        this.logger.log(`Committing changes for course_id: ${id}`);

        if (Object.keys(commitedChangesDto).length !== 0)
            await this.courseService.commitChanges(id, commitedChangesDto);

        return {
            response: {
                message: 'Course changes committed successfully',
            },
        };
    }
}
