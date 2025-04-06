import { Injectable, Inject } from '@nestjs/common';

// repository
import { PlanRepository } from '../repository/plan.repo';

// dtos
import { CreatePlanDto } from '../dtos/create.plan.dto';
import { UpdatePlanDto } from '../dtos/update.plan.dto';
import { FindOptionsWhere } from 'typeorm';
import { Plan } from '../entity/plan.entity';

@Injectable()
export class PlansViaAdminService {
    constructor(
        @Inject()
        private readonly planRepository: PlanRepository,
    ) { }


    async createPlan(plan: CreatePlanDto, admin_id: number): Promise<Plan> {
        return await this.planRepository.create(this.planRepository.newPlan(plan, admin_id))
    }

    async findOnePlan(id: number): Promise<Plan> {
        return await this.planRepository.findOne({ id })
    }

    async findAllPlans(filter: FindOptionsWhere<Plan>): Promise<Plan[]> {
        return await this.planRepository.find(filter);
    }

    async updatePlan(plan_id: number, admin_id: number, newPlan: UpdatePlanDto) {
        await this.planRepository.findOneAndUpdate(
            { id: plan_id },
            {
                ...newPlan,
                updated_by: { id: admin_id }
            }
        );
    }

    async active(plan_id: number, admin_id: number) {
        await this.planRepository.findOneAndUpdate(
            { id: plan_id },
            {
                is_active: true,
                updated_by: { id: admin_id }
            }
        );
    }

    async de_active(plan_id: number, admin_id: number) {
        await this.planRepository.findOneAndUpdate(
            { id: plan_id },
            {
                is_active: false,
                updated_by: { id: admin_id }
            }
        );
    }
}
