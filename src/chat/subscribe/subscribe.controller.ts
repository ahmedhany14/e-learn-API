import {
    Body,
    ConflictException,
    Controller,
    Get,
    Inject,
    NotFoundException,
    Post,
} from '@nestjs/common';

// auth
import { AUTH, ExtractAccountData, ROLE } from '@app/decorators';
import { RoleEnum, AuthEnum } from '@app/enums';

// dtos
import { JoinRoomDto } from './dto/join.room.dto';
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

    @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.INSTRUCTOR, RoleEnum.ADMIN)
    @Post('join-chat-room')
    async join(@Body() room: JoinRoomDto, @ExtractAccountData('id') user_id: number) {
        return {
            response: {
                message: 'chat room joined successfully.',
                chat_id: room.room_id,
            },
        };
    }
}
