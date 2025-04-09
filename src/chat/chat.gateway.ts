import { Inject, UseGuards } from '@nestjs/common';

import {
    WebSocketGateway,
    SubscribeMessage,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
    MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chat-room.service';
import { JwtPayload } from './adapters/ws-jwt.adapter';
import { SubscribeService } from './subscribe/subscribe.service';

interface SocketWithAuth extends Socket {
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
    constructor(
        @Inject()
        private readonly subscribeService: SubscribeService
    ) { }

    async handleConnection(client: SocketWithAuth) {
        try {
            const userId = client.data.user.id;

            const subscribedRooms = await this.subscribeService.findAllRoomSubscribers({
                subscriber: {
                    id: userId
                }
            });

            // Join all rooms
            await Promise.all(
                subscribedRooms.map(room =>
                    client.join(`room:${room.room.room_id}`)
                )
            );

            // Send rooms info back to client
            client.emit('join:rooms', {
                rooms: subscribedRooms.map(room => (
                    {
                        id: room.id,
                        room_id: room.room.room_id,
                        room_name: room.room.name,
                        room_description: room.room.description
                    }))
            });
        } catch (error) {
            client.emit('error', {
                message: 'Failed to join rooms',
                error: error.message
            });
            client.disconnect();
        }
    }

    handleDisconnect(client: SocketWithAuth) {
        console.log(`Client disconnected: ${client.id} - User: ${client.data.user.email}`);
    }

    @SubscribeMessage('test')
    handleMessage() {
        console.log('sadasdasd')
    }
}
