import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { SubscribeService } from '../subscribe/subscribe.service';
import { SendMessageDto } from '../dtos/send.message.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class IsYourRoomGuard implements CanActivate {
    constructor(
        @Inject()
        private readonly SubscribeService: SubscribeService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const wsContext = context.switchToWs();
        const data: SendMessageDto = wsContext.getData();

        const isYourRoom = await this.SubscribeService.findOneRoom({
            id: data.id,
        });

        if (!isYourRoom) throw new WsException('Room not found');

        if (isYourRoom.room_id !== data.room_id)
            throw new WsException('Unauthorized to access this room');

        return true;
    }
}
