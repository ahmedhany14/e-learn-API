import { Module } from '@nestjs/common';
import { SubscribeModule } from './subscribe/subscribe.module';
import { ChatGateway } from './chat.gateway';
import { ChatRoomService } from './chat-room.service';
import { AuthModule } from 'src/auth/auth.module';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from './entity/messages.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Messages]), SubscribeModule, AuthModule, AccountModule],
    providers: [ChatGateway, ChatRoomService],
})
export class ChatModule {}
