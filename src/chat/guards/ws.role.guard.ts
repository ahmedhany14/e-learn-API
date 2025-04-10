import { RoleEnum } from '@app/enums';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SocketI } from '../interfaces/socket.client.interface';

@Injectable()
export class WsRoleGuard implements CanActivate {
    constructor(private readonly allowedRoles: RoleEnum[]) {}

    canActivate(context: ExecutionContext): boolean {
        const client: SocketI = context.switchToWs().getClient();
        const user = client.data?.user;
        return !(!user || !this.allowedRoles.includes(user.role));
    }
}
