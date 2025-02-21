import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractCourseDate = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.course?.[data] : request.course;
  },
);
