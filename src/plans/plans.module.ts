import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entity/plan.entity';
import { PlanRepository } from './plan.repo';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Plan]),
        PaginationModule
    ],
    providers: [
        PlansService,
        PlanRepository
    ],
    exports: [PlansService, PlanRepository]
})
export class PlansModule { }
