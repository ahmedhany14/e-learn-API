import { Inject, Injectable } from '@nestjs/common';
import { EntollCoursesRepo } from '../repository/entoll-courses.repo';

@Injectable()
export class EnrollCoursesService {
    constructor(
        @Inject()
        private readonly entollCoursesRepo: EntollCoursesRepo
    ) { }

    createNewEnrolledCourse(account_id: number, course_id: number) {
        return this.entollCoursesRepo.createNewEnrolledCourse(account_id, course_id);
    }

}
