import { Module } from '@nestjs/common';
import { CourseCommitsReview } from './entity/course.commits.review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseCommitsService } from './course_commits.service';
import { CourseCommitsRepository } from './course.commits.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CourseCommitsReview
        ])
    ],
    providers: [CourseCommitsService, CourseCommitsRepository],
})
export class CourseCommitsModule { }
