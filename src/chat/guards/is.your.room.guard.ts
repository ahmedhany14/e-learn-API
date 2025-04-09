import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { Socket } from 'socket.io';

import { SubscribeService } from '../subscribe/subscribe.service';
import { WsException } from '@nestjs/websockets';
import { SendMessageDto } from '../send.message.dto';
import * as console from 'node:console';

@Injectable()
export class IsYourRoomGuard implements CanActivate {
    constructor(
        @Inject()
        private readonly SubscribeService: SubscribeService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const wsContext = context.switchToWs();
        const data$ = wsContext.getData();
        const data: SendMessageDto = await firstValueFrom(data$);

        const isYourRoom = await this.SubscribeService.findOneRoom({
            id: data.id,
        });

        if (isYourRoom.room_id !== data.room_id) {
            throw new WsException({
                message: 'Unauthorized',
                status: 401,
            });
        }

        console.log('his room');
        return true;
    }
}
