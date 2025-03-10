import { Module } from '@nestjs/common';

// controllers
import { TagsViaAdminsController } from './controllers/tags.via.admins.controller';

// services
import { TagsService } from './services/tags.service';
import { TagsRepository } from './repository/tags.repo';

// orm and entity
import { Tags } from './entity/tags.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Tags])],
    controllers: [TagsViaAdminsController],
    providers: [TagsService, TagsRepository],
})
export class TagsModule {}
