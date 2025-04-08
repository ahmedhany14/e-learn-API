import { Body, Controller, Get, Inject, Logger, Patch, UseGuards } from '@nestjs/common';
import { ProfileService } from './services/profile.service';

// decorators and types
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';
import { ExtractAccountData } from '@app/decorators';

// dto
import { UpdateProfileDto } from './dtos/update.profile.dto';

// guards
import { IsUniqueNumberGuard } from './guards/is.unique.number.guard';

@Controller('profile')
export class ProfileController {
    private readonly logger = new Logger(ProfileController.name);

    constructor(
        @Inject()
        private profileService: ProfileService,
    ) {}

    @AUTH(AuthEnum.BEARER)
    @Get('my-profile')
    async getProfile(@ExtractAccountData('id') account_id: number) {
        this.logger.log('Fetching profile');

        const profile = await this.profileService.findOne({
            account: { id: account_id },
        });

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
        @ExtractAccountData('id') account_id: number,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        this.logger.log('Updating profile', account_id);
        await this.profileService.findOneAndUpdate(
            {
                account: { id: account_id },
            },
            updateProfileDto,
        );
        return {
            response: 'Profile updated successfully',
        };
    }

    @ROLE(RoleEnum.USER)
    @AUTH(AuthEnum.BEARER)
    @Patch('visibility')
    async changeVisibility(@ExtractAccountData('id') account_id: number) {
        this.logger.log('Changing profile visibility');

        await this.profileService.changeVisibility(account_id);

        return {
            response: 'Profile visibility changed successfully',
        };
    }
}
