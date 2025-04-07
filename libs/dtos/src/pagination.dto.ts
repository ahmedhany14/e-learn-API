import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum State {
    APPROVED = 'approved',
    PENDING = 'pending',
    REJECTED = 'rejected',
}

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsEnum(State, {
        message: 'State must be either approved, pending, or rejected',
    })
    state?: string;
}
