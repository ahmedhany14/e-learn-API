import { Module } from '@nestjs/common';

// controllers
import { TagsController } from './tags.controller';

// services
import { TagsService } from './services/tags.service';
import { TagsRepository } from './repository/tags.repo';

// orm and entity
import { Tags, TagsSchema } from './entity/tags.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tags.name,
        schema: TagsSchema
      }
    ])
  ],
  controllers: [TagsController],
  providers: [TagsService, TagsRepository],
})
export class TagsModule { }
