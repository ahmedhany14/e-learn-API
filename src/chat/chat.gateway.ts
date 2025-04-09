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
import { JwtPayload } from './adapters/ws-jwt.adapter';
import { SubscribeService } from './subscribe/subscribe.service';
import { RoleEnum } from '@app/enums';
import { WsRoleGuard } from './guards/ws.role.guard';
import { IsYourRoomGuard } from './guards/is.your.room.guard';
import { SendMessageDto } from './send.message.dto';
import { firstValueFrom, Observable } from 'rxjs';
import * as console from 'node:console';

interface SocketI extends Socket {
    data: {
        user: JwtPayload;
    };
}

@WebSocketGateway(3001, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
    allowEIO3: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject()
        private readonly subscribeService: SubscribeService,
        @Inject()
        private readonly chatRoomService: ChatRoomService,
    ) {}

    @UseGuards(new WsRoleGuard([RoleEnum.USER]))
    @SubscribeMessage('test')
    handleMessage(client: SocketI) {
        console.log('Working');
        client.emit('test:event', {
            message: 'Hello from server',
        });
    }

    async handleConnection(client: SocketI) {
        try {
            const userId = client.data.user.id;

            const subscribedRooms = await this.subscribeService.findAllRoomSubscribers({
                subscriber: {
                    id: userId,
                },
            });

            if (client.data.user.role === RoleEnum.INSTRUCTOR) {
                const hisRoom = await this.subscribeService.findOneRoom({
                    instructor: { id: userId },
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
            // Join all rooms
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

            client.emit('join:your:room', {});
        } catch (error) {
            client.emit('error', {
                message: 'Failed to join rooms',
                error: error.message,
            });
            client.disconnect();
        }
    }

    handleDisconnect(client: SocketI) {
        console.log(`Client disconnected: ${client.id} - User: ${client.data.user.email}`);
    }

    @UseGuards(new WsRoleGuard([RoleEnum.INSTRUCTOR]), IsYourRoomGuard)
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
