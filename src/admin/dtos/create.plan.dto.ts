import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Name of the subscription plan',
    type: String,
    required: true,
    maxLength: 16,
    example: 'Premium Plan'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  plan_name: string;


  @ApiProperty({
    description: 'Price of the plan in USD',
    type: Number,
    required: true,
    minimum: 0,
    example: 29.99
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  plan_price: number;

  @ApiProperty({
    description: 'Duration of the plan in days',
    type: Number,
    required: true,
    minimum: 1,
    example: 30
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  plan_duration: number;
}
