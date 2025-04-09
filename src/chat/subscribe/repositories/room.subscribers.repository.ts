import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AbstractRepoService } from '@app/abstract.db';
import { RoomSubscribers } from '../entities/room.subscribers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RoomSubscribersRepository extends AbstractRepoService<RoomSubscribers> {
    protected readonly logger: Logger = new Logger(RoomSubscribersRepository.name);

    constructor(
        @InjectRepository(RoomSubscribers)
        private readonly roomSubscribersRepository: Repository<RoomSubscribers>,
        entityManager: EntityManager,
    ) {
        super(roomSubscribersRepository, entityManager);
    }

    createNewRoomSubscriber(room_id: number, subscriber_id: number) {
        try {
            return this.roomSubscribersRepository.create({
                room: { id: room_id },
                subscriber: { id: subscriber_id },
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error creating room subscriber',
                details: error.message,
            });
        }
    }
}
