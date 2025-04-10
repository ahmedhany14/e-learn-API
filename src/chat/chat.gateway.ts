import { Inject, Logger, UseFilters, UseGuards } from '@nestjs/common';

import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

// services
import { ChatRoomService } from './chat-room.service';
import { SubscribeService } from './subscribe/subscribe.service';

// enums, dtos, and interfaces
import { RoleEnum } from '@app/enums';
import { SendMessageDto } from './dtos/send.message.dto';
import { SocketI } from './interfaces/socket.client.interface';

// guards and interceptors
import { WsExceptionsFilter } from '@app/interceptors';
import { WsAuthGuard } from './guards/ws.auth.guard';
import { WsRoleGuard } from './guards/ws.role.guard';
import { IsYourRoomGuard } from './guards/is.your.room.guard';
import * as console from 'node:console';
import { GetRoomMessagesHistoryDto } from './dtos/get.room.messages.history.dto';

@UseFilters(new WsExceptionsFilter())
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
    private readonly logger: Logger = new Logger(ChatGateway.name);

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

    @UseGuards(new WsRoleGuard([RoleEnum.INSTRUCTOR]), IsYourRoomGuard)
    @UseGuards(WsAuthGuard)
    @SubscribeMessage('send:message')
    async handleSendMessage(@MessageBody() message: SendMessageDto) {
        this.logger.log(message);
        const newMessage = await this.chatRoomService.addMessage(message);

        this.server.to(`room:${message.room_id}`).emit('receive:message', {
            message: newMessage,
        });
    }

    @SubscribeMessage('get:room:messages:history')
    async handleGetRoomMessages(@MessageBody() body: GetRoomMessagesHistoryDto) {
        this.logger.log(`get:room:messages:history`, body);

        const response = await this.chatRoomService.findRoomMessagesHistory(body.id, body.page);

        this.server.emit('receive:room:messages:history', {
            response,
        });
    }

    // -----------------------------------------------------------------------------------------------------

    async handleConnection(client: SocketI) {
        try {
            const ret = await this.chatRoomService.validateClient(client);
            if (!ret) throw new WsException('Unauthorized: Invalid token');
            await this.handelInstructorChatJoin(client);
            await this.handleUserChatsJoin(client);
        } catch (err) {
            this.logger.error(`Connection rejected for ${client.id}`, err);
            client.disconnect();
            // Already handled and disconnected inside validateClient
        }
    }

    handleDisconnect(client: SocketI) {
        console.log(`Client disconnected: ${client.id}}`);
    }

    private async handelInstructorChatJoin(client: SocketI) {
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

        await Promise.all(subscribedRooms.map((room) => client.join(`room:${room.room.room_id}`)));

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
}
