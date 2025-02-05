import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('file')
export class FileController {
  constructor(
    @Inject()
    private readonly fileService: FileService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCourseImage(@UploadedFile() file: Express.Multer.File) {
    await this.fileService.resizeAndOptimize(file);

    return {
      response: {
        message: 'Course image uploaded successfully',
        fileName: file.filename,
      },
    };
  }
}
