import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractAccountData = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return data ? request.account?.[data] : request.account;
    },
);
