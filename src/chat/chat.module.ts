import { Module } from '@nestjs/common';
import { SubscribeModule } from './subscribe/subscribe.module';

@Module({
  imports: [SubscribeModule]
})
export class ChatModule {}
