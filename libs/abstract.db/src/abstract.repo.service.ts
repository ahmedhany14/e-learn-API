import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { AbstractEntity } from 'y/abstract.db/abstract.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class AbstractRepoService<T extends AbstractEntity<T>> {
    private readonly logger = new Logger('AbstractRepoService');

    protected constructor(
        private readonly entityRepository: Repository<T>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(entity: T): Promise<T> {
        this.logger.log('Creating entity');
        try {
            return await this.entityRepository.save(entity);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error creating entity',
                error: error.message,
            });
        }
    }

    async findOne(where: FindOptionsWhere<T>): Promise<T> {
        this.logger.log('Finding one entity');
        try {
            return await this.entityRepository.findOne({ where });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error finding entity',
                error: error.message,
            });
        }
    }

    async findOneAndUpdate(
        where: FindOptionsWhere<T>,
        partialEntity: QueryDeepPartialEntity<T>,
    ): Promise<T> {
        this.logger.log('Finding one entity and updating');
        try {
            const entity = await this.entityRepository.update(where, partialEntity);
            if (!entity.affected) {
                throw new NotFoundException({
                    message: 'Entity not found',
                });
            }

            return this.findOne(where);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error finding and updating entity',
                error: error.message,
            });
        }
    }

    async find(where: FindOptionsWhere<T>): Promise<T[]> {
        this.logger.log('Finding entities');
        try {
            return await this.entityRepository.findBy(where);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error finding entities',
                error: error.message,
            });
        }
    }

    async findOneAndDelete(where: FindOptionsWhere<T>): Promise<void> {
        this.logger.log('Finding one entity and deleting');
        try {
            await this.entityRepository.delete(where);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error finding and deleting entity',
                error: error.message,
            });
        }
    }
}
