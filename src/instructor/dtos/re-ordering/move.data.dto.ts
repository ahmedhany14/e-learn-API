import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    Min,
    ValidateIf
} from 'class-validator';
import { MoveTypeENUM } from './enum/move.type.enum';


export class MoveDataDTO {
    /**  
     * Should be in any request body  
     */
    @IsEnum(MoveTypeENUM)
    @IsNotEmpty()
    moveMode: MoveTypeENUM;

    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    new_order: number;

    /*
        will be validated only if moveMode is 'video_in_same_section'
    */

    @ValidateIf((obj) => obj.moveMode === MoveTypeENUM.VIDEO_FROM_SECTION_TO_SECTION)
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    new_section_id: number;
}
