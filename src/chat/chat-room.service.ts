import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Socket } from 'socket.io';

// interfaces and entities
import { JwtPayload } from './interfaces/jwt.interface';
import { Messages } from './entity/messages.entity';

// services
import { AccountService } from 'src/account/service/account.service';
import { TokenProvider } from 'src/auth/providers/token.provider';
import { AbstractRepoService } from '@app/abstract.db';
import { SendMessageDto } from './dtos/send.message.dto';
import * as console from 'node:console';
import { SocketI } from './interfaces/socket.client.interface';

@Injectable()
export class ChatRoomService extends AbstractRepoService<Messages> {
    protected readonly logger: Logger = new Logger(ChatRoomService.name);

    constructor(
        @InjectRepository(Messages)
        private readonly messagesRepository: Repository<Messages>,
        entityManager: EntityManager,
        private readonly tokenProvider: TokenProvider,
        private readonly accountService: AccountService,
    ) {
        super(messagesRepository, entityManager);
    }

    async addMessage(sendMessageDto: SendMessageDto): Promise<Messages> {
        const message = this.messagesRepository.create({
            chat_room: { id: sendMessageDto.id },
            content: sendMessageDto.content,
        });

        console.log(message);
        return await this.save(message);
    }

    async findRoomMessagesHistory(id: number, page: number) {
        return await this.paginate(
            {
                chat_room: { id },
            },
            this.messagesRepository,
            '',
            page,
            20,
        );
    }

    async validateClient(client: SocketI) {
        const token = this.extractToken(client);
        if (!token) {
            throw new WsException('Unauthorized: Token is missing');
        }

        let payload: JwtPayload;
        try {
            payload = await this.tokenProvider.verifyToken<JwtPayload>(token, 'access');
        } catch (error) {
            client.emit('error', { message: 'Invalid token' });
            client.disconnect();
            throw new WsException('Unauthorized: Invalid token');
        }

        const account = await this.accountService.findById({ id: payload.id });
        if (!account || !account.is_active || account.has_been_banned) {
            throw new WsException('Unauthorized: Account is not active or banned');
        }

        client.data.user = account;
        client.data.userId = account.id;
        client.data.payload = payload;

        return {
            account,
            payload,
        };
    }

    private extractToken(socket: SocketI): string | null {
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
