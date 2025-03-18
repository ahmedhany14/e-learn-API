import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CourseEnum } from 'src/courses/entities/course.enums';

export const ExtractCourseDate = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return data ? request.course?.[data] : request.course as CourseEnum;
    },
);
