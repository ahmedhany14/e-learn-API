import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    @MaxLength(16)
    first_name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(16)
    last_name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(256)
    bio?: string;

    @IsString()
    @IsOptional()
    @MaxLength(16)
    phone_number?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    linkedin?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    github?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    twitter?: string;
}
