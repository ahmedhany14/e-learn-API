import { IsEnum, IsNotEmpty } from 'class-validator';
import { MoveTypeENUM } from './enum/move.type.enum';


export class MoveModeDTO {
    @IsEnum(MoveTypeENUM)
    @IsNotEmpty()
    moveMode: MoveTypeENUM;
}
