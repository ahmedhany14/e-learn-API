import { Injectable } from '@nestjs/common';
import { CourseCommitsRepository } from './course.commits.repository';
import { CommitedChangesDto } from 'src/courses/dtos/commited.changes.dto';

@Injectable()
export class CourseCommitsService {

    constructor(
        private readonly courseCommitsRepository: CourseCommitsRepository,
    ) { }

    async create(
        course_id: number,
        commitedChangesDto: CommitedChangesDto
    ) {
        return await this.courseCommitsRepository.create(
            this.courseCommitsRepository.newCourseCommitsReview(
                course_id,
                commitedChangesDto,
            ),
        );
    }

}
