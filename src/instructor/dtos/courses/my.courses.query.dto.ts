import { IsOptional, IsString, IsEnum } from 'class-validator';

import { CourseStatusEnum } from '../../../courses/enums/course.status.enum';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { PartialType } from '@nestjs/mapped-types';

export class QueryDto extends PartialType(PaginationDto) {
  @IsOptional()
  @IsString()
  @IsEnum(CourseStatusEnum)
  state?: string;
}
