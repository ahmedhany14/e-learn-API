import {
    IsEnum,
    IsOptional
} from "class-validator";

import { CourseReviewEnum } from "../enums/course.review.enum";

export class ReviewStateDto {
    @IsOptional()
    @IsEnum(CourseReviewEnum)
    state: CourseReviewEnum;
}