import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

// constants and enums
import { SelectKey } from '../../common/constants/select.constant';
import { AccountEnum } from '../entity/account.enum';

// services
import { AccountService } from '../service/account.service';

@Injectable()
export class ExtractAccountInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject() private readonly accountService: AccountService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const select =
      this.reflector.get<AccountEnum[]>(SelectKey, context.getHandler()) ?? [];
    if (select.length !== 0 && request.accountId) {
      request.account = await this.accountService.findById(
        request.accountId,
        select,
      );
    }

    return next.handle();
  }
}
