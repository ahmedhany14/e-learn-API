import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

// orm and entity
import { EntityManager, FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../entities/course.entity';

// dto
import { QueryDto } from 'src/courses/dtos/my.courses.query.dto';

import { AbstractRepoService } from '@app/abstract.db';

@Injectable()
export class CourseRepo extends AbstractRepoService<Course> {
    protected readonly logger: Logger = new Logger(CourseRepo.name);

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        entityManager: EntityManager,
    ) {
        super(courseRepository, entityManager);
    }

    newCourse(instructor_id: number): Course {
        try {
            return this.courseRepository.create({
                instructor: { id: instructor_id },
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while creating course',
                details: error.message,
            });
        }
    }

    async getTotalCourses(filter: any): Promise<number> {
        try {
            return await this.courseRepository.count({
                where: filter,
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while fetching total courses',
                details: error.message,
            });
        }
    }

    async findAll(filter: any, queryDto: QueryDto) {
        return await this.paginate(
            filter,
            this.courseRepository,
            'http://localhost:3000/courses/my-courses',
            queryDto.page,
            queryDto.limit,
        );
    }
}
