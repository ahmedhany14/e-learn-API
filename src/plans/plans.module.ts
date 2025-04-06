import { Module } from '@nestjs/common';
import { PlansViaAdminService } from './service/plans.via.admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entity/plan.entity';
import { CoursePlans } from './entity/course.plan.entity';
import { PlanRepository } from './repository/plan.repo';
import { PlansViaAdminsController } from './controllers/plans-via-admins.controller';
import { PlansViaInstructorsController } from './controllers/plans.via.instructors.controller';
import { PlansViaInstructorsService } from './service/plans.via.instructors.service';
import { CoursesModule } from '../courses/courses.module';

@Module({
    imports: [TypeOrmModule.forFeature([Plan, CoursePlans]), CoursesModule],
    providers: [PlansViaAdminService, PlanRepository, PlansViaInstructorsService],
    exports: [PlansViaAdminService, PlanRepository],
    controllers: [PlansViaAdminsController, PlansViaInstructorsController],
})
export class PlansModule {}
