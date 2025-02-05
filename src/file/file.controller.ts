import {
  Controller,
  Inject,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

// services and providers
import { FileService } from './file.service';
import { CourseService } from '../courses/service/course.service';
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';

@Controller('file')
export class FileController {
  constructor(
    @Inject()
    private readonly fileService: FileService,
    @Inject()
    private readonly courseService: CourseService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async test(@UploadedFile() file: Express.Multer.File) {
    //await this.fileService.resizeAndOptimize(file);

    return {
      response: {
        message: 'Course image uploaded successfully',
        fileName: file.filename,
      },
    };
  }

  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Post('upload-course-image/:course_id')
  @UseInterceptors(FileInterceptor('course-image'))
  async uploadCourseImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('course_id') course_id: string,
  ) {
    const course = await this.courseService.getCourse(parseInt(course_id));
    if (!course) throw new NotFoundException('Course not found');

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
}
