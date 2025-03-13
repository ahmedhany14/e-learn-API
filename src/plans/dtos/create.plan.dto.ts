import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsPositive,
    MaxLength,
} from 'class-validator';

export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    plan_name: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    plan_price: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    plan_duration: number;

    @IsString()
    @IsNotEmpty()
    plan_description: string;
}
