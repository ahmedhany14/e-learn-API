import { AbstractRepoService } from '@app/abstract.db';
import { Injectable, Logger } from '@nestjs/common';

import { CourseCommitsReview } from './entity/course.commits.review.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommitedChangesDto } from 'src/courses/dtos/commited.changes.dto';

@Injectable()
export class CourseCommitsRepository extends AbstractRepoService<CourseCommitsReview> {
    protected readonly logger: Logger = new Logger(CourseCommitsRepository.name);

    constructor(
        @InjectRepository(CourseCommitsReview)
        private readonly courseCommitsReviewRepository: Repository<CourseCommitsReview>,
        entityManager: EntityManager,
    ) {
        super(courseCommitsReviewRepository, entityManager);
    }


    newCourseCommitsReview(
        course_id: number,
        commitedChangesDto: CommitedChangesDto,
    ) {
        return this.courseCommitsReviewRepository.create({
            ...commitedChangesDto,
            course: {
                id: course_id,
            },
        });
    }
}
