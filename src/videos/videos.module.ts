import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Videos } from './entity/videos.entity';

// services and repository
import { VideosInstructorService } from './services/instructor/videos.instructor.service';
import { VideosInstructorRepo } from './repository/instructor/videos.instructor.repo';

@Module({
    imports: [TypeOrmModule.forFeature([Videos])],
    providers: [VideosInstructorService, VideosInstructorRepo],
    exports: [VideosInstructorService],
})
export class VideosModule { }
