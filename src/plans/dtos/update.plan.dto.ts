import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class UpdatePlanDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    plan_name: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    plan_price: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    plan_duration: number;
}