import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ForbiddenException,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ExtractAdminInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExtractAdminInterceptor.name);

  constructor() {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const account = request.account;
    if (!account) {
      throw new ForbiddenException('Account not found in request');
    }

    if (account.role !== 'instructor') {
      throw new ForbiddenException({
        message: 'You do not have permission to access this resource',
      });
    }

    const instructor = 0; //await this.adminService.findOne({ account: account.id });
    if (!instructor)
      throw new ForbiddenException({
        message: 'instructor not found',
      });

    request.instructor = instructor;

    return next.handle();
  }
}
