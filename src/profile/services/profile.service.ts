import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Profile } from '../entity/profile.entity';
import { ProfileRepository } from '../repository/profile.repo';

// DTOs types and types
import { UpdateProfileDto } from '../dtos/update.profile.dto';
import { ProfileColumns, ProfileRelations } from '../entity/profile.enum';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    constructor(
        @Inject()
        private profileRepository: ProfileRepository,
    ) { }

    async findByPhoneNumber(
        phone_number: string,
        select: string[] = [ProfileColumns.ID, ProfileColumns.PHONE_NUMBER],
        relation: string[] = [ProfileRelations.ACCOUNT],
    ): Promise<Profile> {
        return await this.profileRepository.findByPhoneNumber(
            phone_number,
            select,
            relation,
        );
    }

    async findById(
        id: number,
        select: string[] = [
            ProfileColumns.ID,
            ProfileColumns.FIRST_NAME,
            ProfileColumns.LAST_NAME,
            ProfileColumns.BIO,
            ProfileColumns.PHONE_NUMBER,
            ProfileColumns.PROFILE_IMAGE,
        ],
        relation: string[],
    ): Promise<Profile> {
        return await this.profileRepository.findById(id, select, relation);
    }

    async findByAccountId(
        accountId: number,
        select: string[] = [
            ProfileColumns.ID,
            ProfileColumns.FIRST_NAME,
            ProfileColumns.LAST_NAME,
            ProfileColumns.BIO,
            ProfileColumns.PHONE_NUMBER,
            ProfileColumns.PROFILE_IMAGE,
        ],
        relation: string[] = [],
    ): Promise<Profile> {
        return await this.profileRepository.findByAccountId(
            accountId,
            select,
            relation,
        );
    }

    async updateProfile(
        accountId: number,
        updateProfileDto: UpdateProfileDto,
        select: string[] = [
            ProfileColumns.ID,
            ProfileColumns.FIRST_NAME,
            ProfileColumns.LAST_NAME,
            ProfileColumns.BIO,
            ProfileColumns.PHONE_NUMBER,
        ],
        relation = [ProfileRelations.ACCOUNT],
    ): Promise<void> {
        let profile = await this.profileRepository.findByAccountId(
            accountId,
            select,
        );

        profile = { ...profile, ...updateProfileDto } as Profile;
        this.logger.log(`Profile updated: ${JSON.stringify(profile, null, 2)}`);

        await this.profileRepository.updateProfile(profile);
    }

    async updateProfileImage(
        accountId: number,
        image: string,
        select: string[] = [ProfileColumns.ID, ProfileColumns.PROFILE_IMAGE],
    ): Promise<void> {
        let profile = await this.profileRepository.findByAccountId(
            accountId,
            select,
            [ProfileRelations.ACCOUNT]
        );

        profile.profile_image = image;
        return await this.profileRepository.updateProfile(profile);
    }
}
