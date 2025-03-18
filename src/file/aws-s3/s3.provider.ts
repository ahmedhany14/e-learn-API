import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '../../configurations/config.service';

@Injectable()
export class S3Provider {
    private readonly s3: S3;

    constructor(
        @Inject()
        private readonly configService: ConfigService
    ) {
        this.s3 = new S3({
            accessKeyId: this.configService.awsConfig.access_key,
            secretAccessKey: this.configService.awsConfig.secret_key,
            region: this.configService.awsConfig.region
        });
    }

    async uploadImage(file: Buffer, path: string, contentType: string): Promise<string> {
        const uploadResult = await this.s3.upload({
            Bucket: this.configService.awsConfig.bucket_name,
            Body: file,
            ContentType: contentType,
            Key: path
        }).promise();

        return uploadResult.Key;
    }

    async deleteImage(key: string): Promise<void> {
    }
}
