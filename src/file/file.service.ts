import { Inject, Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';

import { GeneratePathConstants } from '../common/constants/path.constants';
import { ConfigService } from '@nestjs/config';
import * as console from 'node:console';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly storagePath: string;

  constructor(
    @Inject()
    private readonly configService: ConfigService,
  ) {
    this.storagePath = this.configService.get('app.storagePath');
  }

  getDestination(moduleName: string): string {
    switch (moduleName) {

      case 'profile':
        return `${this.storagePath}/profile`;
      case 'course':
        return `${this.storagePath}/courses`;
      default:
        return `${this.storagePath}`;
    }
  }

  async resizeAndOptimize(
    file: Express.Multer.File,
    moduleName: string,
    id: number,
  ) {
    console.log(moduleName)
    const image_name = new GeneratePathConstants().generatePathForProfile(
      id,
      moduleName,
    )
    const dir_path = this.getDestination(moduleName);
    const filePath = dir_path + '/' + image_name;

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
