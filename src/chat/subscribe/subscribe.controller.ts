import { Body, Controller, Post } from '@nestjs/common';

// auth
import { AUTH, ExtractAccountData, ROLE } from '@app/decorators';
import { RoleEnum, AuthEnum } from '@app/enums';
import { JoinRoomDto } from './dto/join.room.dto';
import { CreateRoomDto } from './dto/create.room.dto';

@AUTH(AuthEnum.BEARER)
@Controller('subscribe')
export class SubscribeController {
    @ROLE(RoleEnum.INSTRUCTOR)
    @Post('create-chat-room')
    async create(@ExtractAccountData('id') room_id: number, @Body() createRoomDto: CreateRoomDto) {
        return {
            response: {
                message: 'chat room created successfully.',
                chat_id: room_id,
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
