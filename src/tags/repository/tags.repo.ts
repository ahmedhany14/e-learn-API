import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

// orm and entity
import { Tags } from '../entity/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

// dto and interfaces
import { CreateTagDto } from '../dtos/create.tag.dto';
import { AbstractRepoService } from '@app/abstract.db';

@Injectable()
export class TagsRepository extends AbstractRepoService<Tags> {
    protected readonly logger: Logger = new Logger(TagsRepository.name);

    constructor(
        @InjectRepository(Tags)
        private readonly tagsRepository: Repository<Tags>,
        entityManager: EntityManager,
    ) {
        super(tagsRepository, entityManager);
    }

    newTag(createTagDto: CreateTagDto, admin_id: number) {
        try {
            return this.tagsRepository.create({
                ...createTagDto,
                tag_creator: { id: admin_id },
            });
        } catch (error) {
            this.logger.error('Error while creating new tag', error);
            throw new InternalServerErrorException({
                message: 'Error while creating new tag',
                details: error.message,
            });
        }
    }
}
