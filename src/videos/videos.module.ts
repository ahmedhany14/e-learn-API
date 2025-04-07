import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionsModule } from 'src/sections/sections.module';
import { CoursesModule } from 'src/courses/courses.module';

// controllers
import { VideosViaInstructorController } from './controllers/videos.via.instructor.controller';

import { Videos } from './entity/videos.entity';

// services and repository
import { VideosInstructorService } from './services/instructor/videos.instructor.service';
import { VideosInstructorRepo } from './repository/instructor/videos.instructor.repo';
import { MoveVideosFromSectionToSectionTransaction } from './repository/transactions/move.videos.from.section.to.section.transaction';

@Module({
    imports: [TypeOrmModule.forFeature([Videos]), SectionsModule, CoursesModule],
    providers: [
        VideosInstructorService,
        VideosInstructorRepo,
        MoveVideosFromSectionToSectionTransaction,
    ],
    exports: [VideosInstructorService],
    controllers: [VideosViaInstructorController],
})
export class VideosModule {}
