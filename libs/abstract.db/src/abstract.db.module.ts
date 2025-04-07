import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationsModule } from '@app/configurations';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@app/configurations';
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
    exports: [AbstractRepoService],
})
export class AbstractDbModule {
    static forFeature(schemas: EntityClassOrSchema[]) {
        return TypeOrmModule.forFeature(schemas);
    }
}
