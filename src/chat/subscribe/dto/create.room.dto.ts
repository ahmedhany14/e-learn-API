import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoomDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(256)
    description: string;
}
