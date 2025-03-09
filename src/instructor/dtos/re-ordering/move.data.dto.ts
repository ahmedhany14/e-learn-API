import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Min,
    ValidateIf
} from 'class-validator';

export enum MoveMode {
    SECTION = 'section',
    VIDEO_IN_SAME_SECTION = 'video_in_same_section',
    VIDEO_FROM_SECTION_TO_SECTION = 'video_from_section_to_section',
}

export class MoveModeDTO {
    @IsEnum(MoveMode)
    @IsNotEmpty()
    moveMode: MoveMode;
}

export class AnyNameDTO {
    /**  
     * Should be in any request body  
     */
    @IsEnum(MoveMode)
    @IsNotEmpty()
    moveMode: MoveMode;

    @IsNotEmpty()
    @IsPositive()
    @Min(1)
    new_order: number;

    @ValidateIf((obj) => obj.moveMode === MoveMode.VIDEO_FROM_SECTION_TO_SECTION)
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    new_section_id: number;
}
