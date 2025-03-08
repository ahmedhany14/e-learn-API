import { Body, Controller, Get, Inject, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';

// auth and role decorators
import { AUTH } from '../../auth/decorators/auth.decorator';
import { ROLE } from '../../auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { RoleEnum } from 'src/auth/enums/role.enum';

// decorators
import { ExtractAccountData } from 'src/common/decorators/request.extractData.decorator';

// services and providers
import { CourseService } from 'src/courses/service/course.service';

// dto
import { QueryDto } from '../dtos/my.courses.query.dto';
import { UpdateCourseDto } from '../dtos/update.course.dto';

// guards
import { IsYourCourseGuard } from '../guards/is.your.course.guard';

// validators
import { ObjectIdValidationPipe } from 'src/blog-system/blog/validators/object.id.validation.pipe';
import { CourseEnum, CourseRelations } from 'src/courses/entities/enums/course.enums';

@Controller('instructor-courses')
export class InstructorManageCoursesController {

    private readonly logger = new Logger(InstructorManageCoursesController.name);

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
    async getMyCourses(
        @Query() queryDto: QueryDto,
        @ExtractAccountData('id') account_id: number,
    ) {

        this.logger.log(
            `Getting courses for the instuctor account_id: ${account_id}`,
        );

        const select: CourseEnum[] = [
            CourseEnum.ID,
            CourseEnum.TITLE,
            CourseEnum.DESCRIPTION,
            CourseEnum.IMAGE_URL,
            CourseEnum.STATE,
        ];

        const filter = {
            instructor: account_id,
            state: queryDto.state,
        };

        const my_courses = await this.courseService.getMyCourses(select, [], filter, queryDto,)

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
    async getCourse(
        @Param('course_id', ParseIntPipe) course_id: number,
        @ExtractAccountData('id') account_id: number
    ) {
        this.logger.log(`Getting course with course_id: ${course_id}`);

        const select: CourseEnum[] = [
            CourseEnum.ID,
            CourseEnum.TITLE,
            CourseEnum.DESCRIPTION,
            CourseEnum.REQUIREMENTS,
            CourseEnum.WHAT_YOU_LEARN,
            CourseEnum.PRICE,
            CourseEnum.STATE,
            CourseEnum.IMAGE_URL,
            CourseEnum.VIEWS,
            CourseEnum.RATE,
        ]


        const course = await this.courseService.getCourse(select, [], course_id);

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

        const select: CourseEnum[] = [
            CourseEnum.ID,
            CourseEnum.TITLE,
            CourseEnum.DESCRIPTION,
            CourseEnum.REQUIREMENTS,
            CourseEnum.WHAT_YOU_LEARN,
            CourseEnum.PRICE,
        ];

        const course = await this.courseService.updateCourseData(select, [], course_id, updateCourseDataDto);

        return {
            response: {
                message: 'Course updated successfully',
                data: course,
            },
        };
    }

}
