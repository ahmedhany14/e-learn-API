import { Module } from '@nestjs/common';
import { AbstractRerpositort } from './abstract.mongo.service';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigurationsModule } from '@app/configurations';
import { ConfigService } from '@app/configurations';

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
    static forFeature(models: ModelDefinition[]) {
        return MongooseModule.forFeature(models);
    }
}
