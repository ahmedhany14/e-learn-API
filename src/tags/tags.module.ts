import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/courses/courses.module';

// controllers
import { TagsViaAdminsController } from './controllers/tags.via.admins.controller';
import { TagsViaInstructorController } from './controllers/tags.via.instructor.controller';

// services
import { TagsService } from './services/tags.service';
import { TagsRepository } from './repository/tags.repo';
import { CourseTagsRepoService } from './repository/course.tags.repo.service';
import { CourseTagService } from './services/course.tag.service';

// orm and entity
import { Tags } from './entity/tags.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseTags } from './entity/course.tags.entity';
import { TagsController } from './tags.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Tags, CourseTags]), CoursesModule],
    controllers: [TagsViaAdminsController, TagsViaInstructorController, TagsController],
    providers: [TagsService, TagsRepository, CourseTagsRepoService, CourseTagService],
})
export class TagsModule {}
