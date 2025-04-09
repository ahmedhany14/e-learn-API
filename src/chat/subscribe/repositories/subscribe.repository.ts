import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AbstractRepoService } from '@app/abstract.db';
import { ChatRoom } from '../entities/char.room.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from '../dto/create.room.dto';

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

    creatNewChatRoom(creator_id: number, createRoomDto: CreateRoomDto) {
        this.logger.log('Creating new chat room');
        try {
            return this.chatRoomRepository.create({
                ...createRoomDto,
                room_id: creator_id,
                instructor: { id: creator_id },
            });
        } catch (error) {
            this.logger.log(error);

            throw new InternalServerErrorException({
                message: 'Error creating chat room',
                details: error.message,
            });
        }
    }
}
