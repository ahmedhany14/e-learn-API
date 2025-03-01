import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PlansService } from '../plans.service';

@Injectable()
export class IsExistPlan implements PipeTransform<number> {
  constructor(private readonly plansService: PlansService) { }

  async transform(id: number): Promise<number> {
    const plan = await this.plansService.getPlanById(id);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} does not exist.`);
    }
    return id;
  }
}
