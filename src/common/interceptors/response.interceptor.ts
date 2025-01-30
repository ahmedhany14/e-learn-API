import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);
  constructor(private configService: ConfigService) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;
        const responseTime = `${Date.now() - start}ms`;

        const total = typeof data === 'object' && data?.total ? data.total : 0;
        const page = typeof data === 'object' && data?.page ? data.page : 0;
        const perPage = typeof data === 'object' && data?.per_page ? data.per_page : 0;

        return {
          status: 'success',
          code: statusCode,
          data: data || null,
          error: null,
          meta: {
            total,
            page,
            per_page: perPage,
          },
          metadata: {
            responseTime,
            version: this.configService.get('APP_VERSION'),
          }
        }

      })
    );
  }
}
