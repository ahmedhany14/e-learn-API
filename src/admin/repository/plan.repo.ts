import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';

// orm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../entity/plan.entity';
import { CreatePlanDto } from '../dtos/create.plan.dto';

// dtos
import { PaginationDto } from 'src/common/pagination/pagination.dto';

// services
import { PaginationService } from '../../common/pagination/pagination.service';
import { PlansPaginationDto } from '../dtos/plans.pagination.dto';

@Injectable()
export class PlanRepository {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @Inject()
    private readonly paginationService: PaginationService,
  ) {}

  async createPlan(plan: CreatePlanDto, admin_id: number) {
    try {
      const newPlan = this.planRepository.create({
        ...plan,
        admin_id: { id: admin_id },
        updated_by: { id: admin_id },
      });

      return await this.planRepository.save(newPlan);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error creating plan',
        details: error.message,
      });
    }
  }

  async getAllPlans(
    select: string[],
    filter: any,
    relations: string[],
    plansPaginationDto: PlansPaginationDto,
  ) {
    try {
      return await this.paginationService.paginate<Plan>(
        this.planRepository,
        plansPaginationDto.page,
        plansPaginationDto.limit,
        relations,
        filter,
        select,
        'http://localhost:3000/admin-dashboard/plans',
      );
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'Error fetching plans',
        details: err.message,
      });
    }
  }

  async getPlanById(id: number) {
    try {
      return await this.planRepository.findOne({ where: { id } });
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'Error fetching plan',
        details: err.message,
      });
    }
  }
}
