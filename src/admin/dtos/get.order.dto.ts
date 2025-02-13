import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrderDto {
  @ApiProperty({
    description: 'Unique identifier of the order',
    type: Number,
    required: true,
    example: 1234,
  })
  @IsNotEmpty()
  @IsNumber()
  order_id: number;
}