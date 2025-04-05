import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Profile } from '../entity/profile.entity';
import { ProfileRepository } from '../repository/profile.repo';

// DTOs types and types
import { UpdateProfileDto } from '../dtos/update.profile.dto';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    constructor(
        @Inject()
        private profileRepository: ProfileRepository,
    ) {}

    async findById(id: number): Promise<Profile> {
        return await this.profileRepository.findOne({ id });
    }

    async findByPhoneNumber(phone_number: string): Promise<Profile> {
        return await this.profileRepository.findOne({ phone_number });
    }

    async findByAccountId(account_id: number): Promise<Profile> {
        return await this.profileRepository.findOne({ account: { id: account_id } });
    }

    async updateProfile(accountId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
        await this.profileRepository.findOneAndUpdate(
            { account: { id: accountId } },
            updateProfileDto,
        );
    }

    async updateProfileImage(accountId: number, profile_image: string): Promise<void> {
        await this.profileRepository.findOneAndUpdate(
            { account: { id: accountId } },
            { profile_image },
        );
    }

    async changeVisibility(account_id: number) {
        await this.profileRepository.changeVisibility(account_id);
    }
}
