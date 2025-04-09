import { Module } from '@nestjs/common';
import { SubscribeModule } from './subscribe/subscribe.module';
import { ChatGateway } from './chat.gateway';
import { ChatRoomService } from './chat-room.service';

@Module({
    imports: [SubscribeModule],
    providers: [ChatGateway, ChatRoomService]
})
export class ChatModule { }
