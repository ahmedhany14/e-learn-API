import { Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create.room.dto';
import { SubscribeRepository } from './repositories/subscribe.repository';
import { FindOptionsWhere } from 'typeorm';
import { ChatRoom } from './entities/char.room.entity';
import { RoomSubscribers } from './entities/room.subscribers.entity';
import { RoomSubscribersRepository } from './repositories/room.subscribers.repository';

@Injectable()
export class SubscribeService {
    constructor(
        @Inject()
        private readonly SubscribeRepository: SubscribeRepository,
        @Inject()
        private readonly RoomSubscribersRepository: RoomSubscribersRepository,
    ) {}

    async findOneRoom(filter: FindOptionsWhere<ChatRoom>): Promise<ChatRoom> {
        return await this.SubscribeRepository.findOne(filter);
    }

    async findOneRoomSubscriber(
        filter: FindOptionsWhere<RoomSubscribers>,
    ): Promise<RoomSubscribers> {
        return await this.RoomSubscribersRepository.findOne(filter);
    }

    async findAllRoomSubscribers(
        filter: FindOptionsWhere<RoomSubscribers>,
    ): Promise<RoomSubscribers[]> {
        return await this.RoomSubscribersRepository.find(filter);
    }

    async createChatRoom(creator_id: number, createRoomDto: CreateRoomDto): Promise<ChatRoom> {
        const room = this.SubscribeRepository.creatNewChatRoom(creator_id, createRoomDto);

        console.log(room);
        return await this.SubscribeRepository.create(room);
    }

    async joinChatRoom(room_id: number, subscriber_id: number): Promise<RoomSubscribers> {
        const roomSubscriber = this.RoomSubscribersRepository.createNewRoomSubscriber(
            room_id,
            subscriber_id,
        );
        return await this.RoomSubscribersRepository.create(roomSubscriber);
    }
}
