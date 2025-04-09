import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AccountService } from 'src/account/service/account.service';
import { TokenProvider } from 'src/auth/providers/token.provider';
import { ChatRoomService } from '../chat-room.service';

@Injectable()
export class WsAuthGuard implements CanActivate {

    constructor(
        @Inject()
        private readonly chatRoomService: ChatRoomService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient();


        const {
            account, payload
        } = await this.chatRoomService.validateClient(client);

        client.data.user = account;
        client.data.userId = account.id;
        client.data.payload = payload;

        return true;
    }

    private extractToken(socket: Socket): string | null {
        const tokenFromAuth = socket.handshake?.auth?.token;
        if (tokenFromAuth) return tokenFromAuth;
        const tokenFromHeaders = socket.handshake?.headers?.authorization;
        if (tokenFromHeaders) {
            const [bearer, token] = tokenFromHeaders.split(' ');
            if (bearer === 'Bearer' && token) {
                return token;
            }
        }

        return null;
    }

}
