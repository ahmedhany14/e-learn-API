import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepoService } from '@app/abstract.db';
import { CoursePlans } from '../entity/course.plan.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlansViaInstructorsService extends AbstractRepoService<CoursePlans> {
    protected readonly logger: Logger = new Logger(PlansViaInstructorsService.name);

    constructor(
        @InjectRepository(CoursePlans)
        private readonly coursePlansRepository: Repository<CoursePlans>,
        entityManager: EntityManager,
    ) {
        super(coursePlansRepository, entityManager);
    }

    newCoursePlan(plan_id: number, course_id: number) {
        try {
            return this.coursePlansRepository.create({
                plan: { id: plan_id },
                course: { id: course_id },
            });
        } catch (error) {
            this.logger.error('Error creating new course plan', error);
            throw error;
        }
    }
}
