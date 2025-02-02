import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ProfileService } from './services/profile.service';

// decorators and enums
import { AUTH } from '../auth/decorators/auth.decorator';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

// dto
import { UpdateProfileDto } from './dtos/update.profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(
    @Inject()
    private profileService: ProfileService,
  ) {}

  @Get('')
  async getProfile(@Query('profileId') profileId: string) {
    return {
      response: await this.profileService.findById(parseInt(profileId)),
    };
  }

  @ROLE(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Post()
  async updateProfileDate(
    @ExtractAccountData('id') accountId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return {
      response: await this.profileService.updateProfile(
        accountId,
        updateProfileDto,
      ),
    };
  }
}
