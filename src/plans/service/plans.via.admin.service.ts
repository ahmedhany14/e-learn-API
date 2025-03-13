import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';

// repository
import { PlanRepository } from '../repository/plan.repo';

// dtos
import { PlansPaginationDto } from '../dtos/plans.pagination.dto';
import { CreatePlanDto } from '../dtos/create.plan.dto';
import { UpdatePlanDto } from '../dtos/update.plan.dto';
import { PlanColumnEnum, PlanRelationEnum } from '../entity/plan.enum';

@Injectable()
export class PlansViaAdminService {
    constructor(
        @Inject()
        private readonly planRepository: PlanRepository,
    ) { }


    async createPlan(plan: CreatePlanDto, admin_id: number) {
        return await this.planRepository.createPlan(plan, admin_id);
    }

    async getPlanById(
        select: PlanColumnEnum[] = [PlanColumnEnum.ID, PlanColumnEnum.PLAN_NAME, PlanColumnEnum.PLAN_PRICE, PlanColumnEnum.PLAN_DURATION, PlanColumnEnum.PLAN_DESCRIPTION],
        relations: PlanRelationEnum[],
        id: number
    ) {
        return await this.planRepository.getPlanById(
            select,
            relations,
            id
        );
    }

    async getAllPlans(
        select: string[],
        filter: any,
        relations: string[],
    ) {
        return await this.planRepository.getAllPlans(
            select,
            filter,
            relations,
        );
    }

    async updatePlan(plan_id: number, admin_id: number, newPlan: UpdatePlanDto) {
        let plan = await this.planRepository.getPlanById(
            [PlanColumnEnum.ID, PlanColumnEnum.PLAN_NAME, PlanColumnEnum.PLAN_PRICE, PlanColumnEnum.PLAN_DURATION, PlanColumnEnum.PLAN_DESCRIPTION],
            [PlanRelationEnum.UPDATED_BY],
            plan_id
        );

        plan = {
            ...plan,
            ...newPlan,
        }
        plan.updated_by.id = admin_id;

        return await this.planRepository.save(plan);
    }

    async active(plan_id: number, admin_id: number) {
        let plan = await this.planRepository.getPlanById(
            [PlanColumnEnum.ID, PlanColumnEnum.IS_ACTIVE],
            [PlanRelationEnum.UPDATED_BY],
            plan_id
        );

        if (!plan) {
            throw new NotFoundException({
                message: `Plan with ID ${plan_id} does not exist.`
            });
        }
        if (plan.is_active) {
            throw new ConflictException({
                message: `Plan with ID ${plan_id} is already active.`
            });
        }
        plan.is_active = !plan.is_active;
        plan.updated_by.id = admin_id

        return await this.planRepository.save(plan);
    }

    async de_active(plan_id: number, admin_id: number) {
        let plan = await this.planRepository.getPlanById(
            [PlanColumnEnum.ID, PlanColumnEnum.IS_ACTIVE],
            [PlanRelationEnum.UPDATED_BY],
            plan_id
        );

        if (!plan) {
            throw new NotFoundException({
                message: `Plan with ID ${plan_id} does not exist.`
            });
        }
        if (!plan.is_active) {
            throw new ConflictException({
                message: `Plan with ID ${plan_id} is already de-active.`
            });
        }
        plan.is_active = !plan.is_active;
        plan.updated_by.id = admin_id

        return await this.planRepository.save(plan);
    }
}
