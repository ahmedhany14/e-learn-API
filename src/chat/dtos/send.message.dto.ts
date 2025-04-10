import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class SendMessageDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    room_id: number;

    @IsNotEmpty()
    @IsString()
    content: string;
}
