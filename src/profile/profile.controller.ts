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

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    @Inject()
    private profileService: ProfileService,
  ) {}

  @ApiOperation({ summary: 'Get user profile' })
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        response: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            bio: { type: 'string', example: 'Software Engineer' },
            phone_number: { type: 'string', example: '+123456789' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        response: {
          type: 'object',
          properties: {
            first_name: { type: 'string', example: 'John' },
            last_name: { type: 'string', example: 'Doe' },
            bio: { type: 'string', example: 'Software Engineer' },
            phone_number: { type: 'string', example: '+123456789' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
