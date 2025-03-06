import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

// orm and entity
import { Course, CourseDocument } from '../entities/course.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// dto
import { QueryDto } from 'src/instructor/dtos/my.courses.query.dto';

// services

@Injectable()
export class CourseRepo {
    private readonly logger = new Logger(CourseRepo.name);

    constructor(
        @InjectModel(Course.name)
        private readonly coursesModel: Model<CourseDocument>,
    ) { }

    async createCourse(account_id: number) {
        try {
            const course = new this.coursesModel({
                instructor: account_id,
            });

            return await course.save();
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error while creating course');
        }
    }

    async getCourse(id: number) {
        try {
            return await this.coursesModel.findOne({ id });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error while fetching course');
        }
    }

    async updateImageName(course_id: number, image_name: string) {
        try {
            await this.coursesModel.findByIdAndUpdate(course_id, {
                image_url: image_name,
            });
            return image_name;
        } catch (error) {
            throw new InternalServerErrorException(
                'Error while updating course image',
            );
        }
    }

    async getMyCourses(filter: any, queryDto: QueryDto) {
        const data = await this.coursesModel.find()
            .where(filter)
            .skip(((queryDto.page ?? 1) - 1) * queryDto.limit)
            .limit(queryDto.limit)

        const totalCourses = await this.coursesModel.find().where(filter).countDocuments();
        const totalPages = Math.ceil(totalCourses * 1.0 / queryDto.limit);
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
                previous: queryDto.page > 1 ? `?page=${queryDto.page - 1}&limit=${queryDto.limit}` : null,
                next: hasMore ? `?page=${queryDto.page + 1}&limit=${queryDto.limit}` : null,
                current: `?page=${queryDto.page}&limit=${queryDto.limit}`,
            }
        };
    }
}
