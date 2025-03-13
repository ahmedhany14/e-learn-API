import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PlansViaAdminService } from '../service/plans.via.admin.service';
import { PlanColumnEnum } from '../entity/plan.enum';

@Injectable()
export class IsExistPlan implements PipeTransform<number> {
    constructor(private readonly plansService: PlansViaAdminService) { }

    async transform(id: number): Promise<number> {
        const plan = await this.plansService.getPlanById([PlanColumnEnum.ID], [], id);
        if (!plan) {
            throw new NotFoundException(`Plan with ID ${id} does not exist.`);
        }
        return id;
    }
}
