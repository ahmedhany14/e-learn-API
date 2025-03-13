import { Inject, Injectable } from '@nestjs/common';
import { CourseTagsRepoService } from '../repository/course.tags.repo.service';
import { AddTagsToCourseDto } from '../dtos/add.tags.to.course.dto';
import { RemoveTagsFromCourseDto } from '../dtos/remove.tags.from.course.dto';

@Injectable()
export class CourseTagService {

    constructor(
        @Inject()
        private readonly CourseTagsRepoService: CourseTagsRepoService
    ) { }

    async addTagsToCourse(course_id: number, tags: AddTagsToCourseDto) {
        return await this.CourseTagsRepoService.addTagsToCourse(course_id, tags);
    }

    async removeTagsFromCourse(course_id: number, tags: RemoveTagsFromCourseDto) {
        return await this.CourseTagsRepoService.removeTagsFromCourse(course_id, tags);
    }
}
