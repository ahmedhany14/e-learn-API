import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepoService } from '@app/abstract.db';
import { ChatRoom } from './entities/char.room.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscribeRepository extends AbstractRepoService<ChatRoom> {
    protected readonly logger: Logger = new Logger(SubscribeRepository.name);

    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
        entityManager: EntityManager,
    ) {
        super(chatRoomRepository, entityManager);
    }

    creatNewChatRoom() {
        this.logger.log('Creating new chat room');
        try {
        } catch (error) {
            throw new Error(`Error creating new chat room: ${error.message}`);
        }
    }
}
