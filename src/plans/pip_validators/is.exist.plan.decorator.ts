import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { PlansViaAdminService } from '../service/plans.via.admin.service';

@Injectable()
export class IsExistPlan implements PipeTransform<number> {
    constructor(private readonly plansService: PlansViaAdminService) {}

    async transform(id: number): Promise<number> {
        const plan = await this.plansService.findOnePlan(id);
        if (!plan) throw new NotFoundException(`Plan with ID ${id} does not exist.`);
        return id;
    }
}
