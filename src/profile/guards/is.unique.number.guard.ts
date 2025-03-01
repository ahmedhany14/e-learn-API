import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as request from 'supertest';
import { ProfileService } from '../services/profile.service';
import { ProfileColumns } from '../entity/profile.enum';

@Injectable()
export class IsUniqueNumberGuard implements CanActivate {
  constructor(@Inject() private readonly profileService: ProfileService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { phone_number } = request.body;
    const accountId = request.accountId;
    if (!phone_number) return true;

    const is_here = await this.profileService.findByPhoneNumber(phone_number, [
      'account',
    ]);

    if (is_here && is_here.account.id !== accountId) {
      throw new ConflictException({
        message: 'Phone number already exists',
        details: `The phone number ${phone_number} already exists, please use another one`,
      });
    }

    return true;
  }
}
