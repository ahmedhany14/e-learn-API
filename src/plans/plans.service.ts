import { Injectable, Inject } from '@nestjs/common';

// repository
import { PlanRepository } from './plan.repo';

// dtos
import { PlansPaginationDto } from './dtos/plans.pagination.dto';
import { CreatePlanDto } from './dtos/create.plan.dto';
import { UpdatePlanDto } from './dtos/update.plan.dto';

@Injectable()
export class PlansService {
    constructor(
        @Inject()
        private readonly planRepository: PlanRepository,
    ) { }


    async createPlan(plan: CreatePlanDto, admin_id: number) {
        return await this.planRepository.createPlan(plan, admin_id);
    }

    async getPlanById(id: number) {
        return await this.planRepository.getPlanById(id);
    }

    async getAllPlans(
        select: string[],
        filter: any,
        relations: string[],
        plansPaginationDto: PlansPaginationDto,
    ) {
        return await this.planRepository.getAllPlans(
            select,
            filter,
            relations,
            plansPaginationDto,
        );
    }

    async updatePlan(plan_id: number, admin_id: number, newPlan: UpdatePlanDto) {
        let plan = await this.planRepository.getPlanById(plan_id);

        plan = {
            ...plan,
            ...newPlan,
        }
        plan.updated_by.id = admin_id;

        return await this.planRepository.save(plan);
    }

    async flipActivationPlan(plan_id: number, admin_id: number) {
        let plan = await this.planRepository.getPlanById(plan_id);
        plan.is_active = !plan.is_active;
        plan.updated_by.id = admin_id

        return await this.planRepository.save(plan);
    }
}
