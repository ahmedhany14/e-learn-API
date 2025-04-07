import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepoService } from '@app/abstract.db';
import { Course } from '../courses/entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class SearchRepository extends AbstractRepoService<Course> {
    protected readonly logger: Logger = new Logger(SearchRepository.name);

    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        entityManager: EntityManager,
    ) {
        super(courseRepository, entityManager);
    }
}
