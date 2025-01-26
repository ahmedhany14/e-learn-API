import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core';

// enums and constants
import { RoleEnum } from '../enums/role.enum';
import { ROLE_TYPE_KEY } from '../../common/constants/role.constants';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // get the role type from the metadata
    const roleType = this.reflector.get<RoleEnum>(
      ROLE_TYPE_KEY,
      context.getHandler(),
    );

    if (!roleType) return true;
    if (roleType !== request.account.role)
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    return true;
  }
}
