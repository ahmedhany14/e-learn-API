import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { AccountEnum } from '../entity/account.enum';
import * as console from 'node:console';

@Injectable()
export class IsUniqueEmailGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.accountId;
    const { email } = request.body;
    const account = await this.accountService.findByEmail(email, [
      AccountEnum.EMAIL,
      AccountEnum.ID,
    ]);

    console.log('account', account);
    console.log('id', id);
    console.log('email', email);
    if (account && account.id !== id) {
      throw new ConflictException({
        message: 'Email is already in use',
        details:
          'Email you are trying to use is already in use, please use another email',
      });
    }

    return true;
  }
}
