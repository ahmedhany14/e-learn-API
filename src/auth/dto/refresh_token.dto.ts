import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    name: 'refreshToken',
    description: 'Refresh token for generating new access token',
    type: String,
    required: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    format: 'jwt'
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
