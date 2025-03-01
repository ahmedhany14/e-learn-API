import { Body, Controller, Get, Inject, Logger, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';


// Auth and Role decorators
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { ROLE } from 'src/auth/decorators/role.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';
import { RoleEnum } from 'src/auth/enums/role.enum';

// decorators and validators
import { ExtractAccountData } from 'src/common/decorators/request.extractData.decorator';
import { IsExistPlan } from '../../plans/pip_validators/is.exist.plan.decorator';

// services
import { PlansService } from 'src/plans/plans.service';

// dtos
import { CreatePlanDto } from 'src/plans/dtos/create.plan.dto';
import { PlansPaginationDto } from 'src/plans/dtos/plans.pagination.dto';
import { UpdatePlanDto } from 'src/plans/dtos/update.plan.dto';
import { response } from 'express';


@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('admin')
export class AdminManagePlansController {
    private readonly logger = new Logger(AdminManagePlansController.name);

    constructor(
        @Inject()
        private readonly planService: PlansService,
    ) { }

    @Post('new-plan')
    async createPlan(
        @Body() createPlanDto: CreatePlanDto,
        @ExtractAccountData('id') admin_id: number,
    ) {
        /*
            API Endpoint to create a new plan
    
            Steps:
                get the admin id from the request
                call the admin service to create a new plan associated with the admin id
        */

        this.logger.log('Create new plan');

        const plan = await this.planService.createPlan(createPlanDto, admin_id);

        return {
            response: {
                message: 'Plan created successfully',
                plan,
            },
        };
    }

    @Get('plans')
    async getAllPlans(@Query() plansPaginationDto: PlansPaginationDto) {
        this.logger.log('Get all plans');

        /*
          API Endpoint to get all plans
    
          steps:
            call the admin service to get all plans
        */

        const select = [];

        const filter = {
            email: plansPaginationDto.email,
        };
        const relations = ['updated_by', 'admin_id'];

        const plans = await this.planService.getAllPlans(
            select,
            filter,
            relations,
            plansPaginationDto,
        );

        return plans;
    }

    @Get('plan/:plan_id')
    async getPlan(@Param('plan_id', ParseIntPipe, IsExistPlan) plan_id: number) {
        this.logger.log(`Get plan with id: ${plan_id}`);

        /*
          API Endpoint to get a plan by id
          steps:
            get the plan id from the request
            call the admin service to get the plan by id
        */

        return {
            response: {
                message: `Plan with id ${plan_id} fetched successfully`,
                plans: await this.planService.getPlanById(plan_id),
            },
        };
    }

    @Patch('plan/:plan_id')
    async updatePlan(
        @Body() updatePlanDto: UpdatePlanDto,
        @Param('plan_id', ParseIntPipe, IsExistPlan) plan_id: number,
        @ExtractAccountData('id') admin_id: number,
    ) {

        const plan = await this.planService.updatePlan(plan_id, admin_id, updatePlanDto);

        return {
            response: {
                message: 'Plan updated successfully',
                plan
            }
        }
    }

}
