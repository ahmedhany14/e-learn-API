import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

// entities
import { Course } from '../../../../courses/entities/course.entity';
import { CourseReview } from '../../entity/course.reviwe.entity';

// enum for course status
import { CourseStatusEnum } from '../../../../courses/enums/course.status.enum';
import { CourseReviewEnum } from '../../enums/course.review.enum';

@Injectable()
export class RejectCourseTransaction {
    constructor(private readonly dataSource: DataSource) {}

    async rejectCourse(admin_id: number, course_id: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(Course, course_id, {
                state: CourseStatusEnum.REJECTED,
            });

            await queryRunner.manager.update(
                CourseReview,
                { course: { id: course_id } },
                {
                    state: CourseReviewEnum.REJECTED,
                    reviewer: { id: admin_id },
                },
            );

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException({
                message: 'An unexpected error occurred',
                details: error.message,
            });
        } finally {
            await queryRunner.release();
        }
    }
}
