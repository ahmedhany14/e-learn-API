import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

// orm and entity
import { FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../entities/course.entity';
// dto
import { QueryDto } from 'src/instructor/dtos/courses/my.courses.query.dto';
import { UpdateCourseDto } from 'src/instructor/dtos/courses/update.course.dto';

import { CourseEnum, CourseRelations } from '../entities/course.enums';

@Injectable()
export class CourseRepo {
    private readonly logger = new Logger(CourseRepo.name);

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) { }

    async createCourse(account_id: number): Promise<Course> {
        try {
            const course = this.courseRepository.create({
                instructor: { id: account_id },
            });

            return await this.courseRepository.save(course);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while creating course',
                details: error.message,
            });
        }
    }

    async findOneById(
        select: CourseEnum[],
        relation: CourseRelations[],
        id: number,
    ): Promise<Course> {
        try {
            return await this.courseRepository.findOne({
                where: { id },
                select: select as FindOptionsSelect<Course>,
                relations: relation,
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException({
                message: 'Error while fetching course',
                details: error.message,
            });
        }
    }

    async updateImageName(
        course_id: number,
        image_name: string,
    ): Promise<string> {
        try {
            const course = await this.courseRepository.findOne({
                where: { id: course_id },
                select: [CourseEnum.ID, CourseEnum.IMAGE_URL],
            });

            course.image_url = image_name;

            await this.courseRepository.save(course);
            return image_name;
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error while updating image name',
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
            console.log('filter', filter);
            console.log('queryDto', queryDto);
            console.log('select', select);

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

            const totalPages = Math.ceil((totalCourses * 1.0) / queryDto.limit);
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
                    next: hasMore
                        ? `?page=${queryDto.page + 1}&limit=${queryDto.limit}`
                        : null,
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

    async updateCourseData(
        select: CourseEnum[],
        relation: CourseRelations[],
        course_id: number,
        updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        try {
            let course = await this.courseRepository.findOne({
                where: { id: course_id },
                select: select as FindOptionsSelect<Course>,
                relations: relation,
            });
            course = {
                ...course,
                ...updateCourseDto,
            };
            return await this.courseRepository.save(course);
        } catch (error) {
            throw new InternalServerErrorException(
                'Error while updating course data',
            );
        }
    }
}
