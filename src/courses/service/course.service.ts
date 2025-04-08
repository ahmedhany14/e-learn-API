import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { CourseRepo } from '../repository/course.repo';

// dto
import { QueryDto } from 'src/courses/dtos/my.courses.query.dto';
import { UpdateCourseDto } from 'src/courses/dtos/update.course.dto';
import { CommitedChangesDto } from '../dtos/commited.changes.dto';
import { CourseCommitsService } from '../../administration/course_commits/course_commits.service';
import { FindOptionsWhere } from 'typeorm';
import { Course } from '../entities/course.entity';

@Injectable()
export class CourseService {
    constructor(
        @Inject()
        private readonly courserRepo: CourseRepo,

        @Inject()
        private readonly courseCommitsService: CourseCommitsService,
    ) { }

    async createCourse(instructor_id: number) {
        return await this.courserRepo.create(this.courserRepo.newCourse(instructor_id));
    }

    async findOne(filter: FindOptionsWhere<Course>) {
        return await this.courserRepo.findOne(filter);
    }

    async updateCourseImage(filter: FindOptionsWhere<Course>, image_url: string) {
        return await this.courserRepo.findOneAndUpdate(filter, { image_url });
    }

    async findOneAndUpdate(filter: FindOptionsWhere<Course>, updateCourseDto: UpdateCourseDto) {
        return await this.courserRepo.findOneAndUpdate(filter, { ...updateCourseDto, },);
    }

    async paginate(filter: FindOptionsWhere<Course>, queryDto: QueryDto) {
        return await this.courserRepo.findAll(filter, queryDto);
    }

    async getTotalCourses(filter: FindOptionsWhere<Course>) {
        return await this.courserRepo.getTotalCourses(filter);
    }

    async commitChanges(
        course_id: number,
        commitedChangesDto: CommitedChangesDto,
    ) {
        await this.courseCommitsService.create(
            course_id,
            commitedChangesDto,
        )
    }
}
