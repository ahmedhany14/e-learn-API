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
    return (await this.profileRepository.findById(id)) ;
  }

  async findByAccountId(accountId: number): Promise<Profile> {
    return (await this.profileRepository.findByAccountId(accountId));
  }

  async updateProfile(
    accountId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    let profile = await this.profileRepository.findByAccountId(accountId);
    if (!profile)
      profile = await this.profileRepository.create(
        updateProfileDto,
        accountId,
      );


    return await this.profileRepository.updateProfile(profile);
  }

  async updateProfileImage(
    accountId: number,
    image: string,
  ): Promise<Profile> {
    let profile = await this.profileRepository.findByAccountId(accountId);
    if (!profile)
      throw new NotFoundException('Profile not found');

    profile.profile_image = image;
    return await this.profileRepository.updateProfile(profile);
  }

}
