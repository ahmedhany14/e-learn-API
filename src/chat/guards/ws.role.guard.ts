import { RoleEnum } from '@app/enums';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsRoleGuard implements CanActivate {

    constructor(private readonly allowedRoles: RoleEnum[]) { }

    canActivate(
        context: ExecutionContext,
    ): boolean {
        const client: Socket = context.switchToWs().getClient();

        const user = client.data?.user;

        if (!user || !this.allowedRoles.includes(user.role)) {
            throw new WsException({
                message: 'Unauthorized',
                status: 401,
            });
        }

        return true;
    }
}
