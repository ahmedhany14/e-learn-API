import { IsOptional, IsString, IsEnum } from 'class-validator';

import { CourseStatusEnum } from '../enums/course.status.enum';
import { PaginationDto } from '@app/dtos';
import { PartialType } from '@nestjs/mapped-types';

export class QueryDto extends PartialType(PaginationDto) {
    @IsOptional()
    @IsString()
    @IsEnum(CourseStatusEnum)
    state?: string;
}
