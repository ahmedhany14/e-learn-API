// src/adapters/ws-jwt.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { INestApplicationContext, Inject } from '@nestjs/common';
import { Server } from 'socket.io';
import { ConfigService } from '@app/configurations';

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

export class WsJwtIoAdapter extends IoAdapter {
    private jwtService: JwtService;

    constructor(
        app: INestApplicationContext,
        @Inject()
        private readonly configService: ConfigService,
    ) {
        super();
        this.jwtService = app.get(JwtService);
    }

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

        server.use(async (socket, next) => {
            try {
                const token = this.extractToken(socket);

                if (!token) {
                    throw new Error('Token not provided');
                }

                const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
                    secret: this.configService.jwtConfig.secret,
                });

                socket.data.user = payload;
                socket.data.userId = payload.id;

                next();
            } catch (error) {
                const errorMessage = this.handleError(error);
                next(new Error(errorMessage));
            }
        });

        return server;
    }

    bindClientConnect(server: any, callback: Function) {
        server.on('connection', callback);
    }

    bindClientDisconnect(client: any, callback: Function) {
        client.on('disconnect', callback);
    }

    bindMessageHandlers(client: any, handlers: any[], transform: (data: any) => any) {
        handlers.forEach(({ message, callback }) => {
            client.on(message, (data: any) => {
                callback(transform ? transform(data) : data);
            });
        });
    }

    private extractToken(socket: any): string | null {
        const tokenFromAuth = socket.handshake?.auth?.token;
        if (tokenFromAuth) return tokenFromAuth;
        const tokenFromHeaders = socket.handshake?.headers?.authorization;
        if (tokenFromHeaders) {
            const [bearer, token] = tokenFromHeaders.split(' ');
            if (bearer === 'Bearer' && token) {
                return token;
            }
        }

        const tokenFromQuery = socket.handshake?.query?.token;
        if (tokenFromQuery) return tokenFromQuery;

        return null;
    }

    private handleError(error: any): string {
        console.log(error.name);

        if (error.name === 'JsonWebTokenError') {
            return 'Invalid token';
        }
        if (error.name === 'TokenExpiredError') {
            return 'Token expired';
        }
        return 'Authentication failed';
    }
}
