import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Profile } from '../entity/profile.entity';
import { ProfileRepository } from '../repository/profile.repo';

// DTOs enums and types
import { UpdateProfileDto } from '../dtos/update.profile.dto';
import { ProfileColumns, ProfileRelations } from '../entity/profile.enum';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @Inject()
    private profileRepository: ProfileRepository,
  ) {}

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
      ProfileColumns.FIRST_NAME,
      ProfileColumns.LAST_NAME,
      ProfileColumns.BIO,
      ProfileColumns.PHONE_NUMBER,
    ],
  ): Promise<Profile> {
    let profile = await this.profileRepository.findByAccountId(
      accountId,
      select,
    );
    profile = { ...profile, ...updateProfileDto };

    return await this.profileRepository.updateProfile(profile);
  }

  async updateProfileImage(
    accountId: number,
    image: string,
    select: string[] = [ProfileColumns.PROFILE_IMAGE],
  ): Promise<Profile> {
    let profile = await this.profileRepository.findByAccountId(
      accountId,
      select,
    );

    profile.profile_image = image;
    return await this.profileRepository.updateProfile(profile);
  }
}
