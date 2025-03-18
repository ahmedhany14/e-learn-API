import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class ImageProcessingProvider {

    async resizeAndOptimize(
        file: Express.Multer.File,
        width: number,
        height: number,
    ): Promise<Buffer> {

        return await sharp(file.buffer)
            .resize(width, height, {
                fit: 'cover',
                position: 'center',

            })
            .toFormat('jpeg')
            .jpeg({ quality: 85 })
            .toBuffer()
    }
}
