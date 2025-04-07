import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CourseRepo } from '../courses/repository/course.repo';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { Repository } from 'typeorm';
import { CourseTags } from '../tags/entity/course.tags.entity';
import { CourseStatusEnum } from 'src/courses/enums/course.status.enum';

@Injectable()
export class SearchRepository {
    private readonly logger: Logger = new Logger(SearchRepository.name);

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        @InjectRepository(CourseTags)
        private readonly courseTagsRepository: Repository<CourseTags>,
    ) { }

    async getCoursesWithTopic(tag: string, rating: number = 0, page: number = 1) {
        try {
            const queryBuilder = this.courseRepository
                .createQueryBuilder('course')
                .leftJoinAndSelect('course.instructor', 'instructor')
                .leftJoinAndSelect('course.course_tags', 'courseTags')
                .leftJoinAndSelect('courseTags.tag', 'tag')
                .where('tag.tag = :tag', { tag })
                .andWhere('course.state = :state', {
                    state: CourseStatusEnum.PUBLISHED
                })
                .andWhere('course.rate >= :rating', { rating })

            const skip = (page - 1) * 10;

            queryBuilder
                .skip(skip)
                .take(10)
                .orderBy('course.rate', 'DESC')
                .addOrderBy('course.views', 'DESC');

            const [courses, total] = await queryBuilder.getManyAndCount();

            const totalPages = Math.ceil(total / 10);
            return {
                data: {
                    courses: courses.map(async (course) => ({
                        id: course.id,
                        title: course.title,
                        description: course.description,
                        image_url: course.image_url,
                        price: course.price,
                        rate: course.rate,
                        views: course.views,
                        instructor: {
                            id: course.instructor.id,
                        },
                        total_sections: (await course.sections).length,
                        total_enrolled: (await course.enrolled_courses).length,
                    })),
                },
                meta: {
                    total,
                    page,
                    totalPages,
                    limit: 10,
                    hasMore: page < totalPages,
                    firstPage: '?page=1&limit=10',
                    lastPage: `?page=${totalPages}&limit=10`,
                    previous: page > 1 ? `?page=${page - 1}&limit=10` : null,
                    next: page < totalPages ? `?page=${page + 1}&limit=10` : null,
                    current: `?page=${page}&limit=10`,
                }
            }
        } catch (error) {
            this.logger.error(error);

            throw new InternalServerErrorException({
                message: 'Error fetching courses with topic',
                details: error.message,
            })

        }
    }
}
