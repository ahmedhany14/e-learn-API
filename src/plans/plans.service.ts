import { Injectable, Inject } from '@nestjs/common';

// orm and entity
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entity/plan.entity';

// repository
import { PlanRepository } from './plan.repo';

// dtos
import { PlansPaginationDto } from './dtos/plans.pagination.dto';
import { CreatePlanDto } from './dtos/create.plan.dto';

@Injectable()
export class PlansService {
    constructor(
        @Inject()
        private readonly planRepository: PlanRepository,
    ) { }


    async createPlan(plan: CreatePlanDto, admin_id: number) {
        return await this.planRepository.createPlan(plan, admin_id);
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

    async getPlanById(id: number) {
        return await this.planRepository.getPlanById(id);
    }
}
