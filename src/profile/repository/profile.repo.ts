import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

// entity and orm
import { Profile } from '../entity/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepoService } from '@app/abstract.db';

@Injectable()
export class ProfileRepository extends AbstractRepoService<Profile> {
    protected readonly logger = new Logger(ProfileRepository.name);

    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        entityManager: EntityManager,
    ) {
        super(profileRepository, entityManager);
    }

    async changeVisibility(accountId: number): Promise<void> {
        try {
            const profile = await this.profileRepository.findOne({
                where: { account: { id: accountId } },
            });

            profile.visible = !profile.visible;

            await this.profileRepository.update(profile.id, profile);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'An unexpected error occurred',
                error: error.message,
            });
        }
    }
}
