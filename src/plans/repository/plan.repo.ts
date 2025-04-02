import {
    Injectable,
    Inject,
    InternalServerErrorException,
} from '@nestjs/common';

// orm
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions, FindOptionsSelect, Repository } from 'typeorm';
import { Plan } from '../entity/plan.entity';
import { CreatePlanDto } from '../dtos/create.plan.dto';

// dtos
import { PlanColumnEnum, PlanRelationEnum } from '../entity/plan.enum';


@Injectable()
export class PlanRepository {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepository: Repository<Plan>,
    ) { }

    async createPlan(plan: CreatePlanDto, admin_id: number) {
        try {
            const newPlan = this.planRepository.create({
                ...plan,
                admin: { id: admin_id },
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
    ) {
        try {
            return await this.planRepository.find({
                select: select as FindOptionsSelect<Plan>,
                where: filter,
                relations,
            });
        } catch (err) {
            throw new InternalServerErrorException({
                message: 'Error fetching plans',
                details: err.message,
            });
        }
    }

    async getPlanById(
        select: PlanColumnEnum[],
        relations: PlanRelationEnum[],
        id: number
    ) {
        try {
            return await this.planRepository.findOne({
                where: { id },
                select: select as FindOptionsSelect<Plan>,
                relations,
            });
        } catch (err) {
            throw new InternalServerErrorException({
                message: 'Error fetching plan',
                details: err.message,
            });
        }
    }

    async save(plan: Plan) {
        try {
            return await this.planRepository.save(plan);
        } catch (err) {
            throw new InternalServerErrorException({
                message: 'Error saving plan',
                details: err.message,
            });
        }
    }
}
