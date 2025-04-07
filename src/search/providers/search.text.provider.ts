import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../profile/entity/profile.entity';
import { Brackets, Repository } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { SearchQueryDto } from '../dto/search.quary.dto';
import { CourseStatusEnum } from '../../courses/enums/course.status.enum';

@Injectable()
export class SearchTextProvider {
    private readonly logger: Logger = new Logger(SearchTextProvider.name);

    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async getSearchQuery(text: string, searchQueryDto: SearchQueryDto) {
        const statistics = await this.numberOfCoursesWithTag(text);
        const instructors = await this.instructorData(text);

        const { coursesWithMetaData, totalCourses, totalPages } = await this.coursesWithMetaData(
            text,
            searchQueryDto,
        );

        return {
            response: {
                text,
                totalCourses: totalCourses,
                coursesStatistics: statistics,
                instructors: instructors,
                courses: coursesWithMetaData,
            },
            meta: {
                total: totalCourses,
                page: searchQueryDto.page || 1,
                totalPages: totalPages,
                limit: 10,
                hasMore: searchQueryDto.page < totalPages,
                firstPage: '?page=1&limit=10',
                lastPage: `?page=${totalPages}&limit=10`,
                previous:
                    searchQueryDto.page > 1 ? `?page=${searchQueryDto.page - 1}&limit=10` : null,
                next:
                    searchQueryDto.page < totalPages
                        ? `?page=${searchQueryDto.page + 1}&limit=10`
                        : null,
                current: `?page=${searchQueryDto.page}&limit=10`,
            },
        };
    }

    private async numberOfCoursesWithTag(text: string) {
        try {
            const result = await this.courseRepository
                .createQueryBuilder('course')
                .select([
                    'COUNT(DISTINCT course.id) as total_courses',
                    'AVG(course.price) as average_price',
                    'AVG(course.rate) as average_rating',
                    'SUM(course.views) as total_views',
                ])
                .where('course.state = :state', {
                    state: CourseStatusEnum.PUBLISHED,
                })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('LOWER(course.title) LIKE LOWER(:search)', { search: `%${text}%` })
                            .orWhere('LOWER(course.description) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            })
                            .orWhere('LOWER(course.requirements) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            })
                            .orWhere('LOWER(course.what_you_learn) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            });
                    }),
                )
                .getRawOne();

            return {
                total_courses: parseInt(result.total_courses) || 0,
                statistics: {
                    average_price: parseFloat(result.average_price) || 0,
                    average_rating: parseFloat(result.average_rating) || 0,
                    total_views: parseInt(result.total_views) || 0,
                },
            };
        } catch (error) {
            this.logger.error(`Error in numberOfCoursesWithTag: ${error}`);
            throw new InternalServerErrorException({
                message: 'Error in numberOfCoursesWithTag',
                detail: error.message,
            });
        }
    }

    private async coursesWithMetaData(text: string, searchQueryDto: SearchQueryDto) {
        try {
            const limit = 10;
            const { rating = 0, page = 1 } = searchQueryDto;
            const skip = (page - 1) * limit;

            const queryBuilder = this.courseRepository
                .createQueryBuilder('course')
                .leftJoinAndSelect('course.instructor', 'instructor')
                .leftJoinAndSelect('course.sections', 'sections')
                .leftJoinAndSelect('sections.videos', 'videos')
                .leftJoinAndSelect('course.enrolled_courses', 'enrolled_courses')
                .where('course.state = :state', {
                    state: CourseStatusEnum.PUBLISHED,
                })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('LOWER(course.title) LIKE LOWER(:search)', { search: `%${text}%` })
                            .orWhere('LOWER(course.description) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            })
                            .orWhere('LOWER(course.requirements) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            })
                            .orWhere('LOWER(course.what_you_learn) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            });
                    }),
                );

            if (rating > 0) {
                queryBuilder.andWhere('course.rate >= :rating', { rating });
            }

            // Get total count
            const totalCount = await queryBuilder.getCount();
            const totalPages = Math.ceil(totalCount / limit);

            // Add pagination
            const courses = await queryBuilder
                .select([
                    'course.id as id',
                    'course.title as title',
                    'course.description as description',
                    'course.image_url as image_url',
                    'course.price as price',
                    'course.rate as rate',
                    'COUNT(DISTINCT enrolled_courses.id) as total_enrolled',
                    'COUNT(DISTINCT sections.id) as total_sections',
                    'COUNT(DISTINCT videos.id) as total_lectures',
                ])
                .groupBy('course.id')
                .orderBy('course.rate', 'DESC')
                .skip(skip)
                .take(limit)
                .getRawMany();

            const coursesWithMetaData = courses.map((course) => ({
                id: course.id,
                title: course.title,
                description: course.description,
                image_url: course.image_url,
                price: parseFloat(course.price),
                rate: parseFloat(course.rate),
                total_enrolled: parseInt(course.total_enrolled),
                total_sections: parseInt(course.total_sections),
                total_lectures: parseInt(course.total_lectures),
            }));

            return {
                coursesWithMetaData,
                totalCourses: totalCount,
                totalPages,
            };
        } catch (error) {
            this.logger.error(`Error in coursesWithMetaData: ${error}`);
            throw new InternalServerErrorException({
                message: 'Error in coursesWithMetaData',
                detail: error.message,
            });
        }
    }

    private async instructorData(text: string) {
        try {
            const instructors = await this.courseRepository
                .createQueryBuilder('course')
                .select([
                    'DISTINCT instructor.id as id',
                    'profile.first_name as first_name',
                    'profile.last_name as last_name',
                ])
                .leftJoin('course.instructor', 'instructor')
                .leftJoin('instructor.profile', 'profile')
                .where('course.state = :state', {
                    state: CourseStatusEnum.PUBLISHED,
                })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('LOWER(course.title) LIKE LOWER(:search)', { search: `%${text}%` })
                            .orWhere('LOWER(course.description) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            })
                            .orWhere('LOWER(course.requirements) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            })
                            .orWhere('LOWER(course.what_you_learn) LIKE LOWER(:search)', {
                                search: `%${text}%`,
                            });
                    }),
                )
                .getRawMany();

            return instructors.map((instructor) => ({
                id: instructor.id,
                first_name: instructor.first_name || 'N/A',
                last_name: instructor.last_name || 'N/A',
            }));
        } catch (error) {
            this.logger.error(`Error in instructorData: ${error}`);
            throw new InternalServerErrorException({
                message: 'Error in instructorData',
                detail: error.message,
            });
        }
    }
}
