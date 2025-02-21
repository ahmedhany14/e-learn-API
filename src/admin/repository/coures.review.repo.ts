import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CourseReview } from './../entity/courses/course.reviwe.entity';

@Injectable()
export class CourseReviewRepository {
  private readonly logger = new Logger(CourseReviewRepository.name);

  constructor(
    @InjectRepository(CourseReview)
    private readonly courseReviewRepository: Repository<CourseReview>,
    private readonly dataSource: DataSource,
  ) {}

  async createCourseReview(course_id: number): Promise<CourseReview> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let savedCourseReview: CourseReview;
    this.logger.log(`transaction started`);
    try {
      const courseReview = queryRunner.manager.create(CourseReview, {
        course: { id: course_id },
      });
      this.logger.log(`course review created`);

      await queryRunner.manager.update('courses', course_id, {
        status: 'in_review',
      });
      this.logger.log(`course state updated to in_review`);

      savedCourseReview = await queryRunner.manager.save(courseReview);

      this.logger.log(`course review saved`);

      await queryRunner.commitTransaction();

      this.logger.log(`transaction commited`);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Error while creating course review, ${error.message}`);
      throw new InternalServerErrorException({
        message: 'Error while creating course review, please try again',
      });
    } finally {
      await queryRunner.release();
    }

    return savedCourseReview;
  }
}
