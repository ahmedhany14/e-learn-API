import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './search.repository';

// entities and orm
import { CourseTags } from '../tags/entity/course.tags.entity';
import { Course } from '../courses/entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Course, CourseTags])],
    controllers: [SearchController],
    providers: [SearchService, SearchRepository],
})
export class SearchModule {}
