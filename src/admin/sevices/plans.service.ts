import { Injectable, Inject } from '@nestjs/common';

// orm and entity
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../entity/plan.entity';

// repository
import { PlanRepository } from '../repository/plan.repo';

// dtos
import { PlansPaginationDto } from '../dtos/plans.pagination.dto';

@Injectable()
export class PlansService {
  constructor(
    @Inject()
    private readonly planRepo: PlanRepository,
  ) {}

  async getAllPlans(
    select: string[],
    filter: any,
    relations: string[],
    plansPaginationDto: PlansPaginationDto,
  ) {
    return await this.planRepo.getAllPlans(
      select,
      filter,
      relations,
      plansPaginationDto,
    );
  }

  async getPlanById(id: number) {
    return await this.planRepo.getPlanById(id);
  }
}
