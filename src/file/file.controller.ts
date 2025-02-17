import {
  BadRequestException,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

// services and providers
import { FileService } from './file.service';
import { CourseService } from '../courses/service/course.service';

// decorators for auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

// decorators
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { ProfileService } from '../profile/services/profile.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';

@Controller('file')
export class FileController {
  constructor(
    @Inject()
    private readonly fileService: FileService,
    @Inject()
    private readonly courseService: CourseService,
    @Inject()
    private readonly profileService: ProfileService,
  ) {}

  @ApiOperation({
    summary: 'Upload course image',
    description: 'api used by instructor to upload course image',
  })
  @ApiSecurity('access-token')
  @ApiParam({
    name: 'course_id',
    description: 'Course ID',
    example: 1,
    required: true,
  })
  @ApiBody({
    description: 'Course image',
    type: File,
  })
  @ApiResponse({
    status: 200,
    description: 'Course image uploaded successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Course not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Post('upload-course-image/:course_id')
  @UseInterceptors(FileInterceptor('course-image'))
  async uploadCourseImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('course_id') course_id: string,
    @ExtractAccountData('id') account_id: number,
  ) {
    const course = await this.courseService.getCourse(parseInt(course_id));
    if (!course)
      throw new NotFoundException({
        message: 'Course not found',
        details:
          'you are trying to upload image for a course that does not exist',
      });
    if (course.instructor.id !== account_id)
      throw new UnauthorizedException({
        message: 'Unauthorized',
        details: 'You are not the instructor of this course',
      });
    const filename = await this.fileService.resizeAndOptimize(
      file,
      'course',
      parseInt(course_id),
    );

    await this.courseService.updateImageName(parseInt(course_id), filename);

    return {
      response: {
        message: 'Course image uploaded successfully',
        fileName: filename,
      },
    };
  }

  @ApiOperation({
    summary: 'Upload profile image',
    description: 'api used by user to upload profile image',
  })
  @ApiSecurity('access-token')
  @ApiBody({
    description: 'Profile image',
    type: File,
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image uploaded successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ROLE(RoleEnum.USER, RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('profile-image'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @ExtractAccountData('id') account_id: number,
  ) {
    const filename = await this.fileService.resizeAndOptimize(
      file,
      'profile',
      account_id,
    );

    // add it to the DB
    await this.profileService.updateProfileImage(account_id, filename);
    return {
      response: {
        message: 'Profile image uploaded successfully',
        fileName: filename,
      },
    };
  }
}
