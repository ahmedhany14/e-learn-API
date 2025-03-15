import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrolledCourses } from '../entity/enrolled.courses.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntollCoursesRepo {

    constructor(
        @InjectRepository(EnrolledCourses)
        private readonly enrolledCoursesRepository: Repository<EnrolledCourses>
    ) {
    }

    async createNewEnrolledCourse(account_id: number, course_id: number) {
        try {
            const enrolledCourse = this.enrolledCoursesRepository.create({
                account: { id: account_id },
                course: { id: course_id }
            });
            return await this.enrolledCoursesRepository.save(enrolledCourse);
        } catch (e) {
            throw new InternalServerErrorException({
                message: 'Failed to enroll course',
                details: e.message
            });
        }
    }
}
