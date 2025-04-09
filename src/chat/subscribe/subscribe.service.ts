import { Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create.room.dto';
import { SubscribeRepository } from './subscribe.repository';
import { FindOptionsWhere } from 'typeorm';
import { ChatRoom } from './entities/char.room.entity';

@Injectable()
export class SubscribeService {
    constructor(
        @Inject()
        private readonly SubscribeRepository: SubscribeRepository,
    ) {}

    async findOneRoom(filter: FindOptionsWhere<ChatRoom>) {
        return await this.SubscribeRepository.findOne(filter);
    }

    async createChatRoom(creator_id: number, createRoomDto: CreateRoomDto) {
        const room = this.SubscribeRepository.creatNewChatRoom(creator_id, createRoomDto);

        console.log(room);
        return await this.SubscribeRepository.create(room);
    }

    async joinChatRoom() {}
}
