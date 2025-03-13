import {
    IsEnum,
    IsOptional,
} from 'class-validator';

enum CourseType {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    IN_REVIEW = 'in_review',

}

export class CourseTypeDto {
    @IsEnum(CourseType, { message: 'Invalid course type' })
    @IsOptional()
    type: string;
}