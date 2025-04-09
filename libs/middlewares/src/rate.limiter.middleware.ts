import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
    private limiter = rateLimit({
        windowMs: 60 * 1000,
        max: 1000,
        message: {
            status: 'fail',
            code: 429,
            error: {
                message: 'Too many requests, please try again later.',
                details: 'You have exceeded the allowed request limit.',
            },
            data: null,
            meta: {},
            metadata: {
                response_time: '0ms',
                version: 'v1.2.3',
            },
        },
        headers: true,
    });

    use(req: Request, res: Response, next: NextFunction) {
        this.limiter(req, res, next);
    }
}
