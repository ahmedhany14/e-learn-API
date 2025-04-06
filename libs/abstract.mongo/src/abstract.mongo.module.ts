import { Module } from '@nestjs/common';
import { AbstractRerpositort } from './abstract.mongo.service';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigurationsModule } from '../../../src/configurations/configurations.module';
import { ConfigService } from '../../../src/configurations/config.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigurationsModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.databaseConfig.url,
                connectionFactory: (connection) => {
                    connection.set('debug', true);
                    return connection;
                },
            }),
        }),
    ],
    exports: [AbstractRerpositort],
})
export class AbstractMongoModule {
    static forFeature(
        models: ModelDefinition[],
    ) {
        return MongooseModule.forFeature(models);
    }

}
