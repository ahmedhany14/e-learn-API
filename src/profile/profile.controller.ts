import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { ProfileService } from './services/profile.service';

// decorators and enums
import { AUTH } from '../auth/decorators/auth.decorator';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

// dto
import { UpdateProfileDto } from './dtos/update.profile.dto';

// safety types
import { SafeGetProfile } from './types/profile.typeSafety';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    @Inject()
    private profileService: ProfileService,
  ) {}

  @AUTH(AuthEnum.BEARER)
  @Get('')
  async getProfile(@ExtractAccountData('id') accountId: number) {
    this.logger.log('Fetching profile');
    const profile = await this.profileService.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Profile not found');
    return {
      response: new SafeGetProfile(profile),
    };
  }

  @ROLE(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Post()
  async updateProfileDate(
    @ExtractAccountData('id') accountId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    this.logger.log('Updating profile');

    return {
      response: await this.profileService.updateProfile(
        accountId,
        updateProfileDto,
      ),
    };
  }
}
