import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configurations for the application
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './common/config/app.conf';
import databaseConf from './common/config/database.conf';
import envValidation from './common/config/validations.conf';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';

const env = process.env.NODE_ENV;

@Module({
  imports: [
    // Configurations Parameters and Validation
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${env}.env`,
      load: [appConfig, databaseConf],
      validationSchema: envValidation,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
