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

import { ProfileService } from '../services/profile.service';

@Injectable()
export class ExtractAdminInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExtractAdminInterceptor.name);

  constructor(
    @Inject()
    private readonly profileService: ProfileService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const account = request.account;
    if (!account) {
      throw new ForbiddenException('Account not found in request');
    }

    const profile = await this.profileService.findByAccountId(account.id);
    if (!profile) throw new ForbiddenException('Profile not found');

    request.profile = profile;

    return next.handle();
  }
}
