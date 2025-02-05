import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs';

import { storagePath } from '../common/constants/path.constants';

@Injectable()
export class FileService {
  getDestination(moduleName: string): string {
    switch (moduleName) {
      case 'profile':
        return `${storagePath}/profile`;
      case 'course':
        return `${storagePath}/course`;
      default:
        return `${storagePath}`;
    }
  }

  async resizeAndOptimize(file: Express.Multer.File) {
    const fileName = `user-${Date.now()}.jpeg`;
    const filePath = this.getDestination('profile') + '/' + fileName;

    try {
      const folderPath = path.dirname(filePath);

      // if (!fs.existsSync(folderPath)) {
      //   fs.mkdirSync(folderPath, { recursive: true });
      // }
      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 20 })
        .toFile(filePath);

      return fileName;
    } catch (error) {
      console.error('Error during image processing:', error);
      throw new Error('Error during image processing');
    }
  }
}
