import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { CourseTags } from '../entity/course.tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { DataSource } from 'typeorm';
import { AddTagsToCourseDto } from '../dtos/add.tags.to.course.dto';
import { RemoveTagsFromCourseDto } from '../dtos/remove.tags.from.course.dto';

@Injectable()
export class CourseTagsRepoService {
    private readonly logger = new Logger(CourseTagsRepoService.name);

    constructor(private readonly dataSource: DataSource) {}

    async addTagsToCourse(course_id: number, tags: AddTagsToCourseDto): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (let i = 0; i < tags.tag_ids.length; i++) {
                const tag_course = queryRunner.manager.create(CourseTags, {
                    course: { id: course_id },
                    tag: { id: tags.tag_ids[i] },
                });

                await queryRunner.manager.save(tag_course);
            }

            await queryRunner.commitTransaction();
        } catch (error) {
            this.logger.error(`Error adding tag to course: ${error.message}`);
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException({
                message: 'Error adding tag to course',
                details: error.message,
            });
        } finally {
            this.logger.log('all tags added to course');
            await queryRunner.release();
        }
    }

    async removeTagsFromCourse(course_id: number, tags: RemoveTagsFromCourseDto): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (let i = 0; i < tags.tag_ids.length; i++) {
                await queryRunner.manager.delete(CourseTags, {
                    course: { id: course_id },
                    tag: { id: tags.tag_ids[i] },
                });
            }

            await queryRunner.commitTransaction();
        } catch (error) {
            this.logger.error(`Error removing tag from course: ${error.message}`);
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException({
                message: 'Error removing tag from course',
                details: error.message,
            });
        } finally {
            this.logger.log('all tags removed from course');
            await queryRunner.release();
        }
    }
}
