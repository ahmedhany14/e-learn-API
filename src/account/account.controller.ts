import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// dto
import { UpgradeToInstructorDto } from './dtos/upgrade.to.instructor.dto';

// service
import { AccountService } from './service/account.service';
import { Email } from '../common/email/email';

// decorators for auth
import { AUTH } from '../auth/decorators/auth.decorator';
import { ROLE } from '../auth/decorators/role.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { RoleEnum } from '../auth/enums/role.enum';
import { AccountEnum } from './entity/account.enum';

// decorators
import { TokenIsInRedisGuard } from './guards/account.redis.guard';
import { AccountIsExistingDecorator } from './decorators/account.is_existing.decorator';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { ACCOUNT_SELECT } from './decorators/account.select.decorator';

// interceptors
import { ExtractAccountInterceptor } from './interceptors/extract.account.interceptor';

// interfaces
import {
  SafeGetAccount,
  SafeDeactivateAccount,
  SafeDeleteAccount,
  SafeUpgradeToInstructor,
} from './interfaces/accounts.interface';

// swagger
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiSecurity
} from '@nestjs/swagger';

@ApiTags('Account')
@UseInterceptors(ExtractAccountInterceptor)
@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(
    @Inject() private readonly accountService: AccountService,
    @Inject() private readonly email: Email,
  ) {}

  @ACCOUNT_SELECT(
    AccountEnum.ID,
    AccountEnum.EMAIL,
    AccountEnum.ROLE,
    AccountEnum.IS_ACTIVE,
  )
  @AUTH(AuthEnum.BEARER)
  @Get()
  @ApiSecurity('access-token')
  @ApiResponse({
    status: 200,
    description: 'Account data retrieved successfully',
    schema: {
      properties: {
        response: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            role: {
              type: 'string',
              enum: Object.values(RoleEnum),
              example: 'user',
            },
            is_active: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async getAccount(@ExtractAccountData() account: SafeGetAccount) {
    this.logger.log('find account by email attempted');
    return { response: account };
  }

  @ACCOUNT_SELECT(AccountEnum.ID, AccountEnum.IS_ACTIVE)
  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Delete('de-active-account')
  @ApiSecurity('access-token')
  @ApiOperation({
    summary: 'Deactivate account',
    description: 'Deactivates the authenticated user account',
  })
  @ApiResponse({
    status: 200,
    description: 'Account deactivated successfully',
    schema: {
      properties: {
        response: {
          type: 'string',
          example: 'Account de-activated successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({ status: 403, description: 'Forbidden - Invalid role' })
  async deActive(@ExtractAccountData() account: SafeDeactivateAccount) {
    this.logger.log('de-activate account attempted');

    await this.accountService.flipActiveState(account);

    return { response: 'Account de-activated successfully' };
  }

  @ACCOUNT_SELECT(
    AccountEnum.ID,
    AccountEnum.EMAIL,
    AccountEnum.ROLE,
    AccountEnum.IS_ACTIVE,
  )
  @AUTH(AuthEnum.BEARER)
  @Delete()
  @ApiSecurity('access-token')
  @ApiOperation({
    summary: 'Delete account',
    description: 'Permanently deletes the authenticated user account',
  })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
    schema: {
      properties: {
        response: { type: 'string', example: 'Account deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async delete(@ExtractAccountData() account: SafeDeleteAccount) {
    this.logger.log('delete account attempted');

    await this.accountService.delete(account);

    return { response: 'Account deleted successfully' };
  }

  @ACCOUNT_SELECT(AccountEnum.ID)
  @ROLE(RoleEnum.USER)
  @AUTH(AuthEnum.BEARER)
  @Post('upgrade-to-instructor')
  @ApiSecurity('access-token')
  @ApiOperation({
    summary: 'Upgrade to instructor',
    description:
      'Upgrade to instructor by using the token provided in the header',
  })
  @ApiBody({ type: UpgradeToInstructorDto })
  @ApiOperation({
    summary: 'Upgrade to instructor account',
    description: 'Processes a user request to upgrade to instructor status',
  })
  @ApiBody({ type: UpgradeToInstructorDto })
  @ApiResponse({
    status: 200,
    description: 'Upgrade request processed',
    schema: {
      properties: {
        response: {
          type: 'string',
          example: 'Upgrade request sent successfully for review',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Invalid payment details',
  })
  async upgradeToInstructor(
    @Body() upgradeToInstructorDto: UpgradeToInstructorDto,
    @ExtractAccountData() account: SafeUpgradeToInstructor,
  ) {
    this.logger.log('upgrade to instructor attempted');

    const order = await this.accountService.upgradeToInstructor(
      account,
      upgradeToInstructorDto,
    );

    await this.email.sendOrderConfirmationEmail(account.email, order.id);

    return {
      response: 'Upgrade request sent successfully for review',
    };
  }

  @Get('active-account/:account_id/:token')
  @UseGuards(TokenIsInRedisGuard)
  @ApiOperation({
    summary: 'Activate account',
    description: 'Activates an account using the provided activation token',
  })
  @ApiParam({
    name: 'account_id',
    type: 'number',
    description: 'The ID of the account to activate',
    example: 1,
  })
  @ApiParam({
    name: 'token',
    type: 'string',
    description: 'The activation token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhaG1lZC5oYW55QGdtYWlsLmNvbSIsImlhdCI6MTczODU5MjE0MCwiZXhwIjoxNzM4NTk1NzQwLCJhdWQiOiJsb2NhbGhvc3Q6MzAwMCIsImlzcyI6ImxvY2FsaG9zdDozMDAwIn0.YxBTrvN7cYMvPo3Y0JQ-cO3sB3Vgl7P37GCTlcr1kMk',
  })
  @ApiResponse({
    status: 200,
    description: 'Account activated successfully',
    schema: {
      properties: {
        response: { type: 'string', example: 'Account activated successfully' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async activeAccount(
    @Param('account_id', ParseIntPipe, AccountIsExistingDecorator)
    account_id: number,
  ) {
    await this.accountService.activeAccount(account_id);
    return { response: 'Account activated successfully' };
  }
}
