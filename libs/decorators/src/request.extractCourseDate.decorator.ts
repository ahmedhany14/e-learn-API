import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Course } from "src/courses/entities/course.entity";

export const ExtractCourseDate = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return data ? request.course?.[data] : request.course as Course;
    },
);
