import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';

// decorators for auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

// decorators
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

// dto
import { CreateCourseDto } from './dto/create.course.dto';

// services
import { CourseService } from './service/course.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private courseService: CourseService) {}

  @ApiOperation({
    summary: 'Get all courses for the instructor',
    description:
      'api used by instructor or user to get all courses for the instructor',
  })
  @ApiParam({
    name: 'instructor_id',
    description: 'Instructor ID',
    example: 1,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Courses fetched successfully',
    schema: {
      example: {
        response: 'All Courses data',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No courses found | instructor not found',
  })
  @Get('all-instructor-courses/:instructor_id')
  async getAllCourses() {
    /*
    not implemented yet
     */
    return 'All Courses';
  }

  @ApiOperation({
    summary: 'Get an individual course',
    description: 'api used by instructor or user to get an individual course',
  })
  @ApiParam({
    name: 'id',
    description: 'Course ID',
    example: 1,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Course fetched successfully',
    schema: {
      example: {
        response: 'Course data',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  @Get('course/:id')
  async getCourses() {
    /*
    not implemented yet
     */
    return 'Course';
  }

  @ApiOperation({
    summary: 'post a course for the instructor',
    description: 'api used by instructor to create a new course',
  })
  @ApiSecurity('access-token')
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 200,
    description: 'Course created successfully',
    schema: {
      example: {
        response: 'Course created successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Post('course')
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @ExtractAccountData('id') account_id: number,
  ) {
    await this.courseService.createCourse(createCourseDto, account_id);

    return {
      response: 'Course created successfully',
    };
  }

  @ApiOperation({
    summary: 'Update a course data',
    description: 'api used by instructor to update his course data',
  })
  @ApiSecurity('access-token')
  // @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    schema: {
      example: {
        response: 'Course updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Patch('course/:id')
  async updateCourse() {}

  @ApiOperation({
    summary: 'Delete a course',
    description: 'api used by instructor to delete his course',
  })
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 200,
    description: 'Course deleted successfully',
    schema: {
      example: {
        response: 'Course deleted',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Delete('course/:id')
  async deleteCourse() {
    /*
    not implemented yet
     */
    return 'Course deleted';
  }
}
