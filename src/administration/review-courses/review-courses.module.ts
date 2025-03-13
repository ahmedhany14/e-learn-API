import { Module } from '@nestjs/common';
import { ReviewCoursesController } from './review-courses.controller';

// orm
import {CourseReview} from "./entity/course.reviwe.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

// repository
import {CourseReviewRepository} from "./repository/coures.review.repo";
import { ReviewCoursesService } from './services/review-courses.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([CourseReview])
    ],
    controllers: [ReviewCoursesController],
    providers:[CourseReviewRepository, ReviewCoursesService],
    exports: [ReviewCoursesService]
})
export class ReviewCoursesModule {}
