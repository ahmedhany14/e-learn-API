import { BadRequestException, Module } from '@nestjs/common';

// modules
import { CoursesModule } from '../courses/courses.module';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from '../profile/profile.module';

// file upload packages
import * as path from 'path';

// multer
import * as multer from 'multer';
import { MulterModule } from '@nestjs/platform-express';

// controllers
import { FileController } from './file.controller';

// services
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: async (
        request: Request,
        file: Express.Multer.File,
        cb: Function,
      ) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Only JPEG, PNG and JPG image files are allowed!',
            ),
            false,
          );
        }

        const allowedExtensions = ['.jpeg', '.jpg', '.png'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          return cb(
            new BadRequestException(
              'Invalid file extension! Allowed extensions: .jpeg, .jpg, .png, .gif',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),

    CoursesModule,

    ConfigModule,

    ProfileModule
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
