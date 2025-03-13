import { Body, Controller, Delete, Get, Inject, Logger, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';


// Auth and Role decorators
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { ROLE } from 'src/auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { RoleEnum } from 'src/auth/enums/role.enum';

// decorators and validators
import { ExtractAccountData } from 'src/common/decorators/request.extractData.decorator';
import { IsExistPlan } from '../../plans/pip_validators/is.exist.plan.decorator';

// services
import { PlansViaAdminService } from 'src/plans/service/plans.via.admin.service';

// dtos
import { CreatePlanDto } from 'src/plans/dtos/create.plan.dto';
import { PlansPaginationDto } from 'src/plans/dtos/plans.pagination.dto';
import { UpdatePlanDto } from 'src/plans/dtos/update.plan.dto';
import { PlanColumnEnum, PlanRelationEnum } from '../entity/plan.enum';

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('plans-via-admins')
export class PlansViaAdminsController {
    private readonly logger = new Logger(PlansViaAdminsController.name);

    constructor(
        @Inject()
        private readonly plansViaAdminService: PlansViaAdminService,
    ) { }

    @Post('new-plan')
    async createPlan(
        @Body() createPlanDto: CreatePlanDto,
        @ExtractAccountData('id') admin_id: number,
    ) {
        this.logger.log('Create new plan');

        const plan = await this.plansViaAdminService.createPlan(createPlanDto, admin_id);

        return {
            response: {
                message: 'Plan created successfully',
                plan,
            },
        };
    }

    @Get('plans')
    async getAllPlans(
        @Query('is_active') is_active: boolean,
    ) {
        this.logger.log('Get all plans');

        const select = [
            PlanColumnEnum.ID,
            PlanColumnEnum.PLAN_NAME,
            PlanColumnEnum.PLAN_PRICE,
            PlanColumnEnum.PLAN_DURATION,
            PlanColumnEnum.PLAN_DESCRIPTION,
            PlanColumnEnum.IS_ACTIVE,
            PlanColumnEnum.CREATED_AT,
            PlanColumnEnum.UPDATED_AT,
        ];

        const relations = [
            PlanRelationEnum.ADMIN,
            PlanRelationEnum.UPDATED_BY
        ];

        const filter = {
            is_active
        };

        const plans = await this.plansViaAdminService.getAllPlans(
            select,
            filter,
            relations,
        );

        return {
            response: {
                message: 'All plans fetched successfully',
                plans
            }
        };
    }

    @Get('plan/:plan_id')
    async getPlan(@Param('plan_id', ParseIntPipe, IsExistPlan) plan_id: number) {
        this.logger.log(`Get plan with id: ${plan_id}`);

        const plan = await this.plansViaAdminService.getPlanById(
            [
                PlanColumnEnum.ID,
                PlanColumnEnum.PLAN_NAME,
                PlanColumnEnum.PLAN_PRICE,
                PlanColumnEnum.PLAN_DURATION,
                PlanColumnEnum.PLAN_DESCRIPTION,
                PlanColumnEnum.IS_ACTIVE,
                PlanColumnEnum.CREATED_AT,
                PlanColumnEnum.UPDATED_AT,
            ],
            [
                PlanRelationEnum.ADMIN,
                PlanRelationEnum.UPDATED_BY
            ],
            plan_id
        );
        return {
            response: {
                message: `Plan with id ${plan_id} fetched successfully`,
                plan
            },
        };
    }

    @Patch('plan/:plan_id')
    async updatePlan(
        @Body() updatePlanDto: UpdatePlanDto,
        @Param('plan_id', ParseIntPipe, IsExistPlan) plan_id: number,
        @ExtractAccountData('id') admin_id: number,
    ) {

        const plan = await this.plansViaAdminService.updatePlan(plan_id, admin_id, updatePlanDto);

        return {
            response: {
                message: 'Plan updated successfully',
                plan
            }
        }
    }

    @Patch('active-plan/:plan_id')
    async activePlan(
        @Param('plan_id', ParseIntPipe, IsExistPlan) plan_id: number,
        @ExtractAccountData('id') admin_id: number,
    ) {
        const plan = await this.plansViaAdminService.active(plan_id, admin_id);

        return {
            response: {
                message: 'Plan deactivated successfully',
                plan
            }
        }
    }


    @Patch('deactivate-plan/:plan_id')
    async deactivatePlan(
        @Param('plan_id', ParseIntPipe, IsExistPlan) plan_id: number,
        @ExtractAccountData('id') admin_id: number,
    ) {
        const plan = await this.plansViaAdminService.de_active(plan_id, admin_id);

        return {
            response: {
                message: 'Plan deactivated successfully',
                plan
            }
        }
    }
}
