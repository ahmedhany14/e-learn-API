import { Module } from '@nestjs/common';
import { CoursesModule } from '../../courses/courses.module';

// controllers
import { ReviewCoursesController } from './review-courses.controller';

// orm
import { CourseReview } from './entity/course.reviwe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

// repository
import { CourseReviewRepository } from './repository/coures.review.repo';
import { ReviewCoursesService } from './services/review-courses.service';

// transactions
import { ApproveCourseTransaction } from './repository/transactions/approve.transaction';
import { RejectCourseTransaction } from './repository/transactions/reject.transaction';
import { CloseCourseTransaction } from './repository/transactions/close.transaction';

@Module({
    imports: [TypeOrmModule.forFeature([CourseReview]), CoursesModule],
    controllers: [ReviewCoursesController],
    providers: [
        CourseReviewRepository,
        ReviewCoursesService,
        ApproveCourseTransaction,
        RejectCourseTransaction,
        CloseCourseTransaction,
    ],
    exports: [ReviewCoursesService],
})
export class ReviewCoursesModule {}
