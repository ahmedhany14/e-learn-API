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
@Controller('plans/admins')
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

        const plans = await this.plansViaAdminService.find({
            is_active,
        });

        return {
            response: {
                message: 'All plans fetched successfully',
                plans,
            },
        };
    }

    @Get('plan/:id')
    async getPlan(@Param('id', ParseIntPipe, IsExistPlan) id: number) {
        this.logger.log(`Get plan with id: ${id}`);
        const plan = await this.plansViaAdminService.findOne({ id });
        return {
            response: {
                message: `Plan with id ${id} fetched successfully`,
                plan,
            },
        };
    }

    @Patch('plan/:id')
    async updatePlan(
        @Body() updatePlanDto: UpdatePlanDto,
        @Param('id', ParseIntPipe, IsExistPlan) id: number,
        @ExtractAccountData('id') admin_id: number,
    ) {
        const plan = await this.plansViaAdminService.updatePlan({ id }, admin_id, updatePlanDto);

        return {
            response: {
                message: 'Plan updated successfully',
                plan,
            },
        };
    }

    @Patch('active-plan/:id')
    async activePlan(
        @Param('id', ParseIntPipe, IsExistPlan) id: number,
        @ExtractAccountData('id') admin_id: number,
    ) {
        const plan = await this.plansViaAdminService.active({ id }, admin_id);

        return {
            response: {
                message: 'Plan deactivated successfully',
                plan,
            },
        };
    }

    @Patch('deactivate-plan/:id')
    async deactivatePlan(
        @Param('id', ParseIntPipe, IsExistPlan) id: number,
        @ExtractAccountData('id') admin_id: number,
    ) {
        const plan = await this.plansViaAdminService.de_active({ id }, admin_id);

        return {
            response: {
                message: 'Plan deactivated successfully',
                plan,
            },
        };
    }
}
