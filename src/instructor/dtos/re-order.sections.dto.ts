import { IsPositive, Min } from 'class-validator';

export class ReOrderSectionsDto {
  @IsPositive()
  @Min(1)
  new_order: number;
}
