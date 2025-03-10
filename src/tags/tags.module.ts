import { Module } from '@nestjs/common';

// controllers
import { TagsController } from './tags.controller';

// services
import { TagsService } from './services/tags.service';
import { TagsRepository } from './repository/tags.repo';

// orm and entity
import { Tags } from './entity/tags.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Tags])],
    controllers: [TagsController],
    providers: [TagsService, TagsRepository],
})
export class TagsModule {}
