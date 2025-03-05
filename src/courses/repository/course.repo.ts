import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// orm and entity
import { Course, CourseDocument } from '../entities/course.entity';

// dto
import { QueryDto } from 'src/instructor/dtos/my.courses.query.dto';

// services
import { PaginationService } from 'src/common/pagination/pagination.service';
import { Model } from 'mongoose';

@Injectable()
export class CourseRepo {
    private readonly logger = new Logger(CourseRepo.name);

    constructor(
        @InjectModel(Course.name)
        private readonly coursesModel: Model<CourseDocument>,
        @Inject()
        private readonly paginationService: PaginationService,
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

    async getMyCourses(filter: any, select: string[], queryDto: QueryDto) {
        return 'Hello';
        /*await this.paginationService.paginate(
              this.courseRepository,
              queryDto.page,
              queryDto.limit,
              ['instructor'],
              filter,
              select,
              'http://localhost:3000/instructor/my-course',
            );*/
    }
}
