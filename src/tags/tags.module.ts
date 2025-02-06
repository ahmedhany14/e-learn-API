import { Module } from '@nestjs/common';

// controllers
import { TagsController } from './tags.controller';

// services
import { TagsService } from './services/tags.service';
import { TagsRepository } from './repository/tags.repo';

// orm and entity
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tags } from './entity/tags.entity';
import { CourseTags } from './entity/course.tags.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tags, CourseTags])],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
})
export class TagsModule {}
