import { Inject, Injectable, Logger } from '@nestjs/common';
import { ImageProcessingProvider } from './image-processing/image.processing.provider';
import { S3Provider } from './aws-s3/s3.provider';
import path from 'path';
import { v4 as uuid4 } from 'uuid';

import { ConfigService } from '../configurations/config.service';

@Injectable()
export class FileService {
    private readonly logger = new Logger(FileService.name);
    constructor(
        @Inject()
        private readonly imageProcessingProvider: ImageProcessingProvider,

        @Inject()
        private readonly s3Provider: S3Provider,

        @Inject()
        private readonly configService: ConfigService
    ) { }


    private generate_filename(file: Express.Multer.File, folder: string): string {
        file.originalname = file.originalname.replace(' ', '_').trim();
        let name = file.originalname.split('.')[0];
        name.replace(/\s/g, '').trim();
        let extention = '.jpeg';
        let timestamp = new Date().getTime().toString().trim();

        return `${folder}/${name}-${timestamp}-${uuid4()}${extention}`;

    }

    async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
        const processed_image = await this.imageProcessingProvider.resizeAndOptimize(file, 200, 200);
        const fileKey = this.generate_filename(file, folder);
        const s3ResponseKey = await this.s3Provider.uploadImage(
            processed_image,
            fileKey,
            file.mimetype
        );
        const filename = `https://${this.configService.awsConfig.cloudfront_url}/${s3ResponseKey}`;
        return filename;
    }


    async deleteImage(key: string): Promise<void> {
        await this.s3Provider.deleteImage(key);
    }
}
