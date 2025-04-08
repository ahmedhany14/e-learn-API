import { Inject, Injectable } from '@nestjs/common';

import { Profile } from '../entity/profile.entity';
import { ProfileRepository } from '../repository/profile.repo';

// DTOs types and types
import { UpdateProfileDto } from '../dtos/update.profile.dto';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(
        @Inject()
        private profileRepository: ProfileRepository,
    ) {}

    findOne(filter: FindOptionsWhere<Profile>): Promise<Profile> {
        return this.profileRepository.findOne(filter);
    }

    async findOneAndUpdate(
        filter: FindOptionsWhere<Profile>,
        updateProfileDto: UpdateProfileDto,
    ): Promise<void> {
        await this.profileRepository.findOneAndUpdate(filter, updateProfileDto);
    }

    async updateProfileImage(
        filter: FindOptionsWhere<Profile>,
        profile_image: string,
    ): Promise<void> {
        await this.profileRepository.findOneAndUpdate(filter, { profile_image });
    }

    async changeVisibility(account_id: number) {
        await this.profileRepository.changeVisibility(account_id);
    }
}
