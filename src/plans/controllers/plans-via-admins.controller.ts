import {
    Body,
    Controller,
    Get,
    Inject,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

// Auth and Role decorators
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

// decorators and validators
import { ExtractAccountData } from '@app/decorators';
import { IsExistPlan } from '../pip_validators/is.exist.plan.decorator';

// services
import { PlansViaAdminService } from 'src/plans/service/plans.via.admin.service';

// dtos
import { CreatePlanDto } from 'src/plans/dtos/create.plan.dto';
import { UpdatePlanDto } from 'src/plans/dtos/update.plan.dto';

@ROLE(RoleEnum.ADMIN)
@AUTH(AuthEnum.BEARER)
@Controller('plans-via-admins')
export class PlansViaAdminsController {
    private readonly logger = new Logger(PlansViaAdminsController.name);

    constructor(
        @Inject()
        private readonly plansViaAdminService: PlansViaAdminService,
    ) {}

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
    async getAllPlans(@Query('is_active') is_active: boolean) {
        this.logger.log('Get all plans');
        const filter = {
            is_active,
        };

        const plans = await this.plansViaAdminService.findAllPlans(filter);

        return {
            response: {
                message: 'All plans fetched successfully',
                plans,
            },
        };
    }

    @Get('plan/:plan_id')
    async getPlan(@Param('plan_id', ParseIntPipe, IsExistPlan) plan_id: number) {
        this.logger.log(`Get plan with id: ${plan_id}`);
        const plan = await this.plansViaAdminService.findOnePlan(plan_id);
        return {
            response: {
                message: `Plan with id ${plan_id} fetched successfully`,
                plan,
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
                plan,
            },
        };
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
                plan,
            },
        };
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
                plan,
            },
        };
    }
}
