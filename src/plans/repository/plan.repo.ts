import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

// orm
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Plan } from '../entity/plan.entity';
import { CreatePlanDto } from '../dtos/create.plan.dto';

// dtos
import { AbstractRepoService } from '@app/abstract.db';

@Injectable()
export class PlanRepository extends AbstractRepoService<Plan> {
    protected readonly logger = new Logger(PlanRepository.name);

    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>,
        entityManager: EntityManager,
    ) {
        super(planRepository, entityManager);
    }

    newPlan(plan: CreatePlanDto, admin_id: number) {
        try {
            return this.planRepository.create({
                ...plan,
                admin: { id: admin_id },
                updated_by: { id: admin_id },
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error creating new plan',
                details: error.message,
            });
        }
    }
}
