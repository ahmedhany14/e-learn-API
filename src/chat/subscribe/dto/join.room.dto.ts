import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class JoinRoomDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    room_id: number;
}
