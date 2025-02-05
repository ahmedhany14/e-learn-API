import { Injectable, InternalServerErrorException } from '@nestjs/common';

// orm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../entity/plan.entity';
import { CreatePlanDto } from '../dtos/create.plan.dto';

@Injectable()
export class PlanRepository {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async createPlan(plan: CreatePlanDto, admin_id: number) {
    try {
      const newPlan = this.planRepository.create({
        ...plan,
        admin_id: { id: admin_id },
        updated_by: { id: admin_id },
      });

      await this.planRepository.save(newPlan);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error creating plan',
        details: error.message,
      });
    }
  }
}
