import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './services/profile.service';

// decorators and enums
import { AUTH } from '../auth/decorators/auth.decorator';
import { ROLE } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { AuthEnum } from '../auth/enums/auth.enum';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { ProfileColumns, ProfileRelations } from './entity/profile.enum';
// dto
import { UpdateProfileDto } from './dtos/update.profile.dto';

// safety types
import { SafeGetProfile } from './types/profile.typeSafety';
import { query } from 'express';
import { IsUniqueNumberGuard } from './guards/is.unique.number.guard';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    @Inject()
    private profileService: ProfileService,
  ) {}

  @AUTH(AuthEnum.BEARER)
  @Get('')
  async getProfile(
    @ExtractAccountData('id') accountId: number,
    @Query('acc') with_account: boolean,
  ) {
    this.logger.log('Fetching profile');

    const select = [
      ProfileColumns.ID,
      ProfileColumns.PROFILE_IMAGE,
      ProfileColumns.FIRST_NAME,
      ProfileColumns.LAST_NAME,
      ProfileColumns.BIO,
      ProfileColumns.PHONE_NUMBER,
      ProfileColumns.CREATED_AT,
      ProfileColumns.UPDATED_AT,
    ];
    const relation = [];

    if (with_account) relation.push(ProfileRelations.ACCOUNT);

    const profile = await this.profileService.findByAccountId(
      accountId,
      select,
      relation,
    );

    return {
      response: {
        profile,
      },
    };
  }

  @UseGuards(IsUniqueNumberGuard)
  @ROLE(RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Patch()
  async updateProfileDate(
    @ExtractAccountData('id') accountId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    this.logger.log('Updating profile', accountId);
    await this.profileService.updateProfile(accountId, updateProfileDto);
    return {
      response: 'Profile updated successfully',
    };
  }
}
