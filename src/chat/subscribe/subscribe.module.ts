import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';

// entities and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/char.room.entity';

// services
import { SubscribeService } from './subscribe.service';
import { SubscribeRepository } from './subscribe.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ChatRoom])],
    controllers: [SubscribeController],
    providers: [SubscribeService, SubscribeRepository],
})
export class SubscribeModule {}
