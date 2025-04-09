import {
    Body,
    ConflictException,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';

// auth
import { AUTH, ExtractAccountData, ROLE } from '@app/decorators';
import { RoleEnum, AuthEnum } from '@app/enums';

// dtos
import { CreateRoomDto } from './dto/create.room.dto';

// services
import { SubscribeService } from './subscribe.service';

@AUTH(AuthEnum.BEARER)
@Controller('subscribe')
export class SubscribeController {
    constructor(
        @Inject()
        private readonly subscribeService: SubscribeService,
    ) {}

    @ROLE(RoleEnum.INSTRUCTOR)
    @Get('chat-room')
    async getChatRoom(@ExtractAccountData('id') room_id: number) {
        const chatRoom = await this.subscribeService.findOneRoom({
            room_id,
        });

        if (!chatRoom) {
            throw new NotFoundException({
                message: 'chat room not found.',
                detail: 'You have not created a chat room yet.',
            });
        }

        return {
            response: {
                message: 'chat room found successfully.',
                chatRoom,
            },
        };
    }

    @ROLE(RoleEnum.INSTRUCTOR)
    @Post('create-chat-room')
    async create(@ExtractAccountData('id') room_id: number, @Body() createRoomDto: CreateRoomDto) {
        const is_exist = await this.subscribeService.findOneRoom({
            room_id,
        });
        if (is_exist) {
            throw new ConflictException({
                message: 'chat room already exists.',
                detail: 'You have already created a chat room before.',
            });
        }

        const room = await this.subscribeService.createChatRoom(room_id, createRoomDto);

        return {
            response: {
                message: 'chat room created successfully.',
                room,
            },
        };
    }

    @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
    @Post('join-chat-room/:room_id')
    async join(
        @ExtractAccountData('id') user_id: number,
        @Param('room_id', ParseIntPipe) room_id: number,
    ) {
        const is_exist_subscription = await this.subscribeService.findOneRoomSubscriber({
            room: { id: room_id },
            subscriber: { id: user_id },
        });

        if (is_exist_subscription) {
            throw new ConflictException({
                message: 'chat room already joined.',
                detail: 'You have already joined this chat room.',
            });
        }

        const room_subscriber = await this.subscribeService.joinChatRoom(room_id, user_id);

        return {
            response: {
                message: 'chat room joined successfully.',
                room_subscriber,
            },
        };
    }
}
