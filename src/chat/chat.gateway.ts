import { Inject, UseGuards } from '@nestjs/common';

import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chat-room.service';
import { JwtPayload } from './interfaces/jwt.interface';
import { SubscribeService } from './subscribe/subscribe.service';
import { RoleEnum } from '@app/enums';
import { WsRoleGuard } from './guards/ws.role.guard';
import { IsYourRoomGuard } from './guards/is.your.room.guard';
import { SendMessageDto } from './send.message.dto';
import { firstValueFrom, Observable } from 'rxjs';
import { WsAuthGuard } from './guards/ws.auth.guard';
import { SocketI } from './interfaces/socket.client.interface';

@WebSocketGateway(3001, {
    namespace: '/chat',
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 20000,
    pingInterval: 25000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject()
        private readonly subscribeService: SubscribeService,
        @Inject()
        private readonly chatRoomService: ChatRoomService,
    ) { }

    @UseGuards(new WsRoleGuard([RoleEnum.USER]))
    @SubscribeMessage('test')
    handleMessage(client: SocketI) {
        console.log('Working');
        client.emit('test:event', {
            message: 'Hello from server',
        });
    }

    private async handelInsructorChatJoin(client: SocketI) {
        if (client.data.user.role === RoleEnum.INSTRUCTOR) {
            const hisRoom = await this.subscribeService.findOneRoom({
                instructor: { id: client.data.userId },
            });
            if (hisRoom) {
                client.join(`room:${hisRoom.room_id}`);
                client.emit('instructor:join:rooms', {
                    id: hisRoom.id,
                    room_id: hisRoom.room_id,
                    room_name: hisRoom.name,
                    room_description: hisRoom.description,
                });
            }
        }
    }

    private async handleUserChatsJoin(client: SocketI) {
        const subscribedRooms = await this.subscribeService.findAllRoomSubscribers({
            subscriber: {
                id: client.data.userId,
            },
        });

        await Promise.all(
            subscribedRooms.map((room) => client.join(`room:${room.room.room_id}`)),
        );

        // Send rooms info back to a client
        client.emit('join:rooms', {
            rooms: subscribedRooms.map((room) => ({
                id: room.id,
                room_id: room.room.room_id,
                room_name: room.room.name,
                room_description: room.room.description,
            })),
        });
    }

    async handleConnection(client: SocketI) {
        try {
            const {
                account,
                payload,
            } = await this.chatRoomService.validateClient(client);

            await this.handelInsructorChatJoin(client);
            await this.handleUserChatsJoin(client);
        } catch (error) {
            console.log(error)
            client.emit('error', {
                message: 'Failed to join rooms',
                error: error.message,
            });
        }
    }

    handleDisconnect(client: SocketI) {
        console.log(`Client disconnected: ${client.id} - User: ${client.data.user.email}`);
    }

    @UseGuards(new WsRoleGuard([RoleEnum.INSTRUCTOR]), IsYourRoomGuard)
    @UseGuards(WsAuthGuard)
    @SubscribeMessage('send:message')
    async handleSendMessage(client: SocketI, @MessageBody() message$: Observable<SendMessageDto>) {
        const message: SendMessageDto = await firstValueFrom(message$);
        /*
        save messages to db latter
         */
        this.server.to(`room:${message.room_id}`).emit('receive:message', {
            content: message.content,
        });
    }
}
