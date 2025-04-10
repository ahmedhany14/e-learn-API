import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class GetRoomMessagesHistoryDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    page: number = 1;
}
