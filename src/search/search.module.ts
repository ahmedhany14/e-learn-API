import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

// entities and orm
import { Course } from '../courses/entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchTagsProvider } from './providers/search.tags.provider';
import { Profile } from 'src/profile/entity/profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Course, Profile])],
    controllers: [SearchController],
    providers: [SearchService, SearchTagsProvider],
})
export class SearchModule { }
