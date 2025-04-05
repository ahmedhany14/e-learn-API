import { Module } from '@nestjs/common';
import { AbstractDbService } from './abstract.db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationsModule } from '../../../src/configurations/configurations.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '../../../src/configurations/config.service';
import { AbstractRepoService } from './abstract.repo.service';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigurationsModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.databaseConfig.host,
                port: configService.databaseConfig.port,
                username: configService.databaseConfig.username,
                password: configService.databaseConfig.password,
                database: configService.databaseConfig.database,
                synchronize: configService.databaseConfig.synchronize,
                autoLoadEntities: configService.databaseConfig.autoLoadEntities,
                namingStrategy: new SnakeNamingStrategy(),
                logger: 'advanced-console', // Use the advanced console logger
            }),
        }),
    ],
    providers: [AbstractDbService, AbstractRepoService],
    exports: [AbstractDbService],
})
export class AbstractDbModule {
    static forFeature(schemas: EntityClassOrSchema[]) {
        return TypeOrmModule.forFeature(schemas);
    }
}
