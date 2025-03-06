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
import { ObjectIdValidationPipe } from 'src/blog-system/blog/validators/object.id.validation.pipe';

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

  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Post('upload-course-image/:course_id')
  @UseInterceptors(FileInterceptor('course-image'))
  async uploadCourseImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('course_id', ObjectIdValidationPipe) course_id: string,
    @ExtractAccountData('id') account_id: number,
  ) {
    const course = await this.courseService.getCourse(course_id);
    if (!course)
      throw new NotFoundException({
        message: 'Course not found',
        details:
          'you are trying to upload image for a course that does not exist',
      });
    if (course.instructor !== account_id)
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
