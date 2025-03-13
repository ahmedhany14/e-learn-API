import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Course } from '../../../../courses/entities/course.entity';
import { CourseReview } from '../../entity/course.reviwe.entity';
import { CourseStatusEnum } from '../../../../courses/enums/course.status.enum';
import { CourseReviewEnum } from '../../enums/course.review.enum';

@Injectable()
export class CloseCourseTransaction {
    private readonly logger = new Logger(CloseCourseTransaction.name);

    constructor(private readonly dataSource: DataSource) {}

    async closeCourse(admin_id: number, course_id: number) {
        this.logger.log(`Closing course with id: ${course_id}`);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(Course, course_id, {
                state: CourseStatusEnum.DRAFT,
            });

            await queryRunner.manager.update(
                CourseReview,
                { course: { id: course_id } },
                {
                    state: CourseReviewEnum.CLOSED,
                    reviewer: { id: admin_id },
                },
            );
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.log(error);

            throw new InternalServerErrorException({
                message: 'An unexpected error occurred',
                details: error.message,
            });
        } finally {
            await queryRunner.release();
        }
    }
}
