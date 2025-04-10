// src/adapters/ws-jwt.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { Server } from 'socket.io';

export class WsChatIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: ServerOptions): Server {
        options = {
            ...options,
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
                credentials: true,
            },
            allowEIO3: true,
            transports: ['websocket', 'polling'],
        };

        const server = super.createIOServer(port, options);
        server.of('/chat').use((socket, next) => {
            console.log('Socket connected to /chat namespace');
            return next();
        });

        return server;
    }
}
