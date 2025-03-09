import { IsPositive, Min } from 'class-validator';

export class ReOrderingDto {
  @IsPositive()
  @Min(1)
  new_order: number;
}
