import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';

// entities and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/char.room.entity';
import { RoomSubscribers } from './entities/room.subscribers.entity';

// services
import { SubscribeService } from './subscribe.service';
import { SubscribeRepository } from './repositories/subscribe.repository';
import { RoomSubscribersRepository } from './repositories/room.subscribers.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ChatRoom, RoomSubscribers])],
    controllers: [SubscribeController],
    providers: [SubscribeService, SubscribeRepository, RoomSubscribersRepository],
})
export class SubscribeModule {}
