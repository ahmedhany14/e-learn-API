import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetDto {
  @ApiProperty({
    description: 'User email address',
    type: String,
    required: true,
    example: 'user@example.com',
    format: 'email',
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
