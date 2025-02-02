import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Profile } from '../entity/profile.entity';
import { ProfileRepository } from '../repository/profile.repo';
import { UpdateProfileDto } from '../dtos/update.profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @Inject()
    private profileRepository: ProfileRepository,
  ) {}

  async findById(id: number): Promise<Profile> {
    return await this.profileRepository.findById(id);
  }

  async updateProfile(
    accountId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    let profile = await this.profileRepository.findByAccountId(accountId);
    if (!profile) {
      throw new NotFoundException({
        message: 'Profile not found',
        details: 'Profile not found for the provided account',
      });
    }
    Object.assign(profile, updateProfileDto);
    return await this.profileRepository.updateProfile(profile);
  }

  async findByAccountId(accountId: number): Promise<Profile> {
    return await this.profileRepository.findByAccountId(accountId);
  }
}
