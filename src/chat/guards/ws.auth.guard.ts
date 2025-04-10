import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatRoomService } from '../chat-room.service';
import * as console from 'node:console';

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(
        @Inject()
        private readonly chatRoomService: ChatRoomService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient();
        const ret = await this.chatRoomService.validateClient(client);
        if (!ret) {
            throw new WsException('Unauthorized: Invalid token');
        }
        const { account, payload } = ret;
        client.data.user = account;
        client.data.userId = account.id;
        client.data.payload = payload;
        return true;
    }
}
