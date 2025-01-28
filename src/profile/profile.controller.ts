import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ProfileService } from './services/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(
    @Inject()
    private profileService: ProfileService,
  ) {}

  @Get('')
  async getProfile(@Query('profileId') profileId: string) {
    return await this.profileService.findById(parseInt(profileId));
  }
}
