import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

// orm and entity
import { EntityManager, FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../entities/course.entity';

// dto
import { QueryDto } from 'src/courses/dtos/my.courses.query.dto';

import { CourseEnum, CourseRelations } from '../entities/course.enums';
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

    async getMyCourses(
        select: CourseEnum[],
        relations: CourseRelations[],
        filter: any,
        queryDto: QueryDto,
    ) {
        try {
            const data = await this.courseRepository.find({
                where: filter,
                select: select as FindOptionsSelect<Course>,
                skip: ((queryDto.page ?? 1) - 1) * queryDto.limit,
                take: queryDto.limit,
                relations: relations,
            });

            const totalCourses = await this.courseRepository.count({
                where: filter,
            });

            const totalPages = Math.ceil(totalCourses / queryDto.limit);
            const hasMore = queryDto.page < totalPages;

            return {
                response: data,
                meta: {
                    total: totalCourses,
                    page: queryDto.page,
                    limit: queryDto.limit,
                    totalPages,
                    hasMore,
                    firstPage: `?page=1&limit=${queryDto.limit}`,
                    lastPage: `?page=${totalPages}&limit=${queryDto.limit}`,
                    previous:
                        queryDto.page > 1
                            ? `?page=${queryDto.page - 1}&limit=${queryDto.limit}`
                            : null,
                    next: hasMore ? `?page=${queryDto.page + 1}&limit=${queryDto.limit}` : null,
                    current: `?page=${queryDto.page}&limit=${queryDto.limit}`,
                },
            };
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while fetching courses',
                details: error.message,
            });
        }
    }
}
