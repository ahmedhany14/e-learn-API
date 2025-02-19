import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class GetOrderDto {
  @IsNotEmpty()
  @IsNumber()
  order_id: number;
}