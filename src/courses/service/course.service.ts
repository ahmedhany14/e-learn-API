import { Inject, Injectable } from '@nestjs/common';

// repository and providers
import { CourseRepo } from '../repository/course.repo';

// dto
import { QueryDto } from 'src/instructor/dtos/my.courses.query.dto';
import { UpdateCourseDto } from 'src/instructor/dtos/courses/update.course.dto';
import { CourseEnum, CourseRelations } from '../entities/enums/course.enums';

@Injectable()
export class CourseService {
    constructor(
        @Inject()
        private readonly courserRepo: CourseRepo,
    ) { }

    async createCourse(account_id: number) {
        return await this.courserRepo.createCourse(account_id);
    }

    async getCourse(
        select: CourseEnum[] = [CourseEnum.ID, CourseEnum.STATE],
        relation: CourseRelations[] = [],
        id: number
    ) {
        return await this.courserRepo.findOneById(
            select,
            relation,
            id
        );
    }

    async updateImageName(course_id: number, image_name: string) {
        return await this.courserRepo.updateImageName(course_id, image_name);
    }

    async getMyCourses(
        select: CourseEnum[] = [CourseEnum.ID, CourseEnum.TITLE, CourseEnum.DESCRIPTION, CourseEnum.PRICE, CourseEnum.IMAGE_URL, CourseEnum.STATE],
        relataion: CourseRelations[] = [],
        filter: any,
        queryDto: QueryDto
    ) {
        return await this.courserRepo.getMyCourses(select, relataion, filter, queryDto);
    }

    async updateCourseData(
        select: CourseEnum[] = [CourseEnum.ID, CourseEnum.TITLE, CourseEnum.DESCRIPTION, CourseEnum.PRICE],
        relation: CourseRelations[] = [],
        course_id: number, updateCourseDto: UpdateCourseDto) {
        return await this.courserRepo.updateCourseData(
            select,
            relation,
            course_id,
            updateCourseDto
        );
    }

}
