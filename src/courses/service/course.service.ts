import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { CourseRepo } from '../repository/course.repo';

// dto
import { QueryDto } from 'src/courses/dtos/my.courses.query.dto';
import { UpdateCourseDto } from 'src/courses/dtos/update.course.dto';
import { CourseEnum, CourseRelations } from '../entities/course.enums';

@Injectable()
export class CourseService {
    constructor(
        @Inject()
        private readonly courserRepo: CourseRepo,
    ) {}

    async createCourse(instructor_id: number) {
        return await this.courserRepo.create(this.courserRepo.newCourse(instructor_id));
    }

    async getCourse(id: number) {
        return await this.courserRepo.findOne({ id });
    }

    async updateImageName(course_id: number, image_url: string) {
        return await this.courserRepo.findOneAndUpdate({ id: course_id }, { image_url });
    }

    async updateCourseData(course_id: number, updateCourseDto: UpdateCourseDto) {
        return await this.courserRepo.findOneAndUpdate(
            { id: course_id },
            {
                ...updateCourseDto,
            },
        );
    }

    async getMyCourses(filter: any, queryDto: QueryDto) {
        return await this.courserRepo.findAll(filter, queryDto);
    }

    async getTotalCourses(filter: any) {
        return await this.courserRepo.getTotalCourses(filter);
    }
}
