import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';

import {
  storagePath,
  courseImageName,
} from '../common/constants/path.constants';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  getDestination(moduleName: string): string {
    switch (moduleName) {
      case 'profile':
        return `${storagePath}/profile`;
      case 'course':
        return `${storagePath}/courses`;
      default:
        return `${storagePath}`;
    }
  }

  async resizeAndOptimize(
    file: Express.Multer.File,
    moduleName: string,
    id: number,
  ) {
    const image_name = courseImageName(id);
    const dir_path = this.getDestination(moduleName);
    const filePath = dir_path + '/' + image_name ;

    try {
      if (!fs.existsSync(dir_path)) {
        fs.mkdirSync(dir_path, { recursive: true });
      }
    } catch (error) {
      this.logger.error(error);
    } finally {
      this.logger.log('file created');
    }
    console.log(image_name, dir_path, filePath);
    try {
      await sharp(file.buffer)
        .resize(200, 200, {
          fit: 'inside',
        })
        .toFormat('jpeg')
        .jpeg({ quality: 50, progressive: true })
        .toFile(filePath);

      return image_name;
    } catch (error) {
      this.logger.log(error);
      throw new Error('Error during image processing');
    }
  }
}
