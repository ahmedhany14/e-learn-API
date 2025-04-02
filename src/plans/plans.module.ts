import { Module } from '@nestjs/common';
import { PlansViaAdminService } from './service/plans.via.admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entity/plan.entity';
import { PlanRepository } from './repository/plan.repo';
import { PlansViaAdminsController } from './controllers/plans-via-admins.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Plan]),
    ],
    providers: [
        PlansViaAdminService,
        PlanRepository
    ],
    exports: [PlansViaAdminService, PlanRepository],
    controllers: [PlansViaAdminsController]
})
export class PlansModule { }
