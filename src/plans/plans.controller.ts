import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import { PlanRepository } from './repository/plan.repo';

@Controller('plans')
export class PlansController {
    constructor(
        @Inject()
        private readonly planRepository: PlanRepository,
    ) {}

    @Get()
    async findAll() {
        const plans = await this.planRepository.find({});
        return {
            response: {
                message: 'Success',
                data: plans,
            },
        };
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const plan = await this.planRepository.findOne({ id });
        return {
            response: {
                message: 'Success',
                data: plan,
            },
        };
    }
}
