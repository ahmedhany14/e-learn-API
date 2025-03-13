import { Module } from '@nestjs/common';
import { PlansViaAdminService } from './service/plans.via.admin.service';
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
        PlansViaAdminService,
        PlanRepository
    ],
    exports: [PlansViaAdminService, PlanRepository]
})
export class PlansModule { }
