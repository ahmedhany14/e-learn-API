import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envValidation from './config.validations';
import { ConfigService } from './config.service';

const env = process.env.NODE_ENV || 'development';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.${env}.env`,
            load: [],
            validationSchema: envValidation,
        }),
    ],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigurationsModule { }
