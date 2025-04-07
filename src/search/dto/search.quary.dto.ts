import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchQueryDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => value ? parseInt(value) : 0)
    rating?: number = 0;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => value ? parseInt(value) : 1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : 1000000)
    price?: number = 1000000;
}