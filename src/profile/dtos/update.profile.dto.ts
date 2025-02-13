import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'ahmed', maxLength: 16, description: 'First name of the user' })
  @IsString()
  @IsOptional()
  @MaxLength(16)
  first_name?: string;

  @ApiPropertyOptional({ example: 'hany', maxLength: 16, description: 'Last name of the user' })
  @IsString()
  @IsOptional()
  @MaxLength(16)
  last_name?: string;

  @ApiPropertyOptional({ example: 'Software engineer with 5 years of experience.', maxLength: 256, description: 'Short bio about the user' })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  bio?: string;

  @ApiPropertyOptional({ example: '+1234567890', maxLength: 16, description: 'User phone number' })
  @IsString()
  @IsOptional()
  @MaxLength(16)
  phone_number?: string;
}
