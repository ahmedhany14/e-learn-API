import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core';

// types and constants
import { RoleEnum } from '@app/enums';
import { ROLE_TYPE_KEY } from '@app/constants';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        // get the role type from the metadata
        const roleTypes = this.reflector.get<RoleEnum[]>(ROLE_TYPE_KEY, context.getHandler());

        if (!roleTypes) return true;

        for (const roleType of roleTypes) if (roleType === request.account.role) return true;

        throw new ForbiddenException('You are not authorized to access this resource');
    }
}
