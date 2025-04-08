import { IsEnum, IsOptional } from 'class-validator';

import { CourseStatusEnum } from '../../../courses/enums/course.status.enum';

export class CourseTypeDto {
    @IsEnum(CourseStatusEnum, { message: 'Invalid course type' })
    @IsOptional()
    state: CourseStatusEnum;
}
