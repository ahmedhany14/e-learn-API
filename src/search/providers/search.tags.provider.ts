import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

// entities
import { Course } from '../../courses/entities/course.entity';

// dtos and enums
import { CourseStatusEnum } from 'src/courses/enums/course.status.enum';
import { SearchQueryDto } from './../dto/search.quary.dto';
import { Profile } from 'src/profile/entity/profile.entity';


@Injectable()
export class SearchTagsProvider {

    private readonly logger: Logger = new Logger(SearchTagsProvider.name);

    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,

        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) { }

    // number of courses with a specific tag
    private async numberOfCoursesWithTag(tag: string) {
        try {
            // Get basic count with additional statistics
            const result = await this.courseRepository
                .createQueryBuilder('course')
                .select([
                    'COUNT(DISTINCT course.id) as total_courses',
                    'AVG(course.price) as average_price',
                    'AVG(course.rate) as average_rating',
                    'SUM(course.views) as total_views'
                ])
                .leftJoin('course.course_tags', 'courseTags')
                .leftJoin('courseTags.tag', 'tag')
                .where('tag.tag = :tag', { tag })
                .andWhere('course.state = :state', {
                    state: CourseStatusEnum.PUBLISHED
                })
                .getRawOne();

            return {
                total_courses: parseInt(result.total_courses) || 0,
                statistics: {
                    average_price: parseFloat(result.average_price) || 0,
                    average_rating: parseFloat(result.average_rating) || 0,
                    total_views: parseInt(result.total_views) || 0
                }
            };

        } catch (error) {
            this.logger.error(`Error in numberOfCoursesWithTag: ${error}`);
            throw new InternalServerErrorException({
                message: "Error in numberOfCoursesWithTag",
                detail: error.message,
            });
        }
    }

    // number of students that enrolled courses with a specific tag
    private async numberOfStudentsEnrolledWithTag(tag: string) {
        try {
            // Using QueryBuilder to get the count of unique students
            const result = await this.courseRepository
                .createQueryBuilder('course')
                .leftJoin('course.course_tags', 'courseTags')
                .leftJoin('courseTags.tag', 'tag')
                .leftJoin('course.enrolled_courses', 'enrolled_courses')
                .where('tag.tag = :tag', { tag })
                .andWhere('course.state = :state', {
                    state: CourseStatusEnum.PUBLISHED
                })
                .select('COUNT(DISTINCT enrolled_courses.account_id)', 'total_students')
                .getRawOne();

            return +result.total_students || 0;

        } catch (error) {
            this.logger.error(`Error in numberOfStudentsEnrolledWithTag: ${error}`);
            throw new InternalServerErrorException({
                message: "Error in numberOfStudentsEnrolledWithTag",
                detail: error.message,
            });
        }
    }
    // instructor data
    /*
        instructor name, id
    */
    private async instructorData(tag: string) {
        try {
            const instructors = await this.profileRepository
                .createQueryBuilder('profile')
                .select([
                    'DISTINCT account.id as id',
                    'profile.first_name as first_name',
                    'profile.last_name as last_name'
                ])
                .leftJoin('profile.account', 'account')
                .leftJoin('account.courses', 'course')
                .leftJoin('course.course_tags', 'courseTags')
                .leftJoin('courseTags.tag', 'tag')
                .where('tag.tag = :tag', { tag })
                .andWhere('course.state = :state', {
                    state: CourseStatusEnum.PUBLISHED
                })
                .getRawMany();

            return instructors.map(instructor => ({
                id: instructor.id,
                first_name: instructor.first_name || 'N/A',
                last_name: instructor.last_name || 'N/A'
            }));

        } catch (error) {
            this.logger.error(`Error in instructorData: ${error}`);
            throw new InternalServerErrorException({
                message: "Error in instructorData",
                error: error.message,
            });
        }
    }
    // courses with meta data 
    /*
        course image, title, price, rate, description, id
        number of students enrolled
        number of sections
        number of lectures
    */
    private async coursesWithMetaData(tag: string, searchQueryDto: SearchQueryDto) {
        try {
            const { rating = 0, page = 1 } = searchQueryDto;
            const limit = 10;
            const skip = (page - 1) * limit;

            const queryBuilder = this.courseRepository
                .createQueryBuilder('course')
                .select([
                    'course.id as id',
                    'course.title as title',
                    'course.description as description',
                    'course.image_url as image_url',
                    'course.price as price',
                    'course.rate as rate',
                    'COUNT(DISTINCT enrolled_courses.id) as total_enrolled',
                    'COUNT(DISTINCT sections.id) as total_sections',
                    'COUNT(DISTINCT videos.id) as total_lectures'
                ])
                .leftJoin('course.enrolled_courses', 'enrolled_courses')
                .leftJoin('course.sections', 'sections')
                .leftJoin('sections.videos', 'videos')
                .leftJoin('course.course_tags', 'courseTags')
                .leftJoin('courseTags.tag', 'tag')
                .where('tag.tag = :tag', { tag })
                .andWhere('course.state = :state', {
                    state: CourseStatusEnum.PUBLISHED
                });

            if (rating > 0) {
                queryBuilder.andWhere('course.rate >= :rating', { rating });
            }

            // Get total count
            const totalCount = await queryBuilder.getCount();
            const totalPages = Math.ceil(totalCount / limit);

            // Add grouping and pagination
            const courses = await queryBuilder
                .groupBy('course.id')
                .orderBy('course.rate', 'DESC')
                .skip(skip)
                .take(limit)
                .getRawMany();

            const coursesWithMetaData = courses.map(course => ({
                id: course.id,
                title: course.title,
                description: course.description,
                image_url: course.image_url,
                price: parseFloat(course.price),
                rate: parseFloat(course.rate),
                total_enrolled: parseInt(course.total_enrolled),
                total_sections: parseInt(course.total_sections),
                total_lectures: parseInt(course.total_lectures)
            }));

            return {
                coursesWithMetaData,
                totalCourses: totalCount,
                totalPages
            };

        } catch (error) {
            this.logger.error(`Error in coursesWithMetaData: ${error}`);
            throw new InternalServerErrorException({
                message: "Error in coursesWithMetaData",
                detail: error.message,
            });
        }
    }

    async getCoursesWithTopic(tag: string, searchQueryDto: SearchQueryDto) {
        const Number_of_learners = await this.numberOfStudentsEnrolledWithTag(tag);
        const statistics = await this.numberOfCoursesWithTag(tag);
        const instructors = await this.instructorData(tag);

        const {
            coursesWithMetaData,
            totalCourses,
            totalPages
        } = await this.coursesWithMetaData(tag, searchQueryDto);


        return {
            response: {
                tag: tag,
                totalCourses: totalCourses,
                coursesStatistics: statistics,
                number_of_learners: Number_of_learners,
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
                previous: searchQueryDto.page > 1 ? `?page=${searchQueryDto.page - 1}&limit=10` : null,
                next: searchQueryDto.page < totalPages ? `?page=${searchQueryDto.page + 1}&limit=10` : null,
                current: `?page=${searchQueryDto.page}&limit=10`,
            }
        }

    }
}