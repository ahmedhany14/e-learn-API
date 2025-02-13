import {
  Controller,
  Post,
  Get,
  Inject,
  Body,
  InternalServerErrorException,
  NotFoundException,
  GoneException,
  BadRequestException,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';

// services and providers
import { AuthService } from './service/auth.service';

// dto and interfaces
import { AccountLoginDto } from './dto/account.login.dto';
import { AccountSignupDto } from './dto/account.signup.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { AccountResetPasswordDto } from './dto/account.reset-password.dto';
import { ForgetDto } from './dto/forget.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';

// decorators and enums
import { AUTH } from './decorators/auth.decorator';
import { ROLE } from './decorators/role.decorator';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { RoleEnum } from './enums/role.enum';
import { AuthEnum } from './enums/auth.enum';
import { AccountEnum } from '../account/entity/account.enum';
import { ACCOUNT_SELECT } from '../account/decorators/account.select.decorator';

// interfaces
import { SafeResetAccountPassword } from '../account/interfaces/accounts.interface';
import { ExtractAccountInterceptor } from '../account/interceptors/extract.account.interceptor';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiHeaders, ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('auth')
@UseInterceptors(ExtractAccountInterceptor)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject() private readonly authService: AuthService) {}

  @AUTH(AuthEnum.NONE)
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in to account' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        response: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'Bearer token',
              example: 'Bearer <token>',
            },
            refreshToken: {
              type: 'string',
              description: 'Refresh token',
              example: '<token>',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: AccountLoginDto })
  async login(@Body() accountLoginDto: AccountLoginDto) {
    this.logger.log('login attempt');

    return { response: await this.authService.login(accountLoginDto) };
  }

  @AUTH(AuthEnum.NONE)
  @Post('sign-up')
  @ApiOperation({ summary: 'Create new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiBody({ type: AccountSignupDto })
  async signUp(@Body() accountSignupDto: AccountSignupDto) {
    this.logger.log('sign up attempt');

    return { response: await this.authService.signUp(accountSignupDto) };
  }

  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Post('sign-out')
  @ApiOperation({ summary: 'Sign out from account' })
  @ApiResponse({ status: 200, description: 'Signed out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signOut() {
    /*
    Not implemented yet
     */

    return { response: 'Sign out' };
  }

  @ApiOperation({
    summary: 'Reset account password',
    description: 'Reset account password',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      properties: {
        response: {
          type: 'object',
          properties: {
            newAccount: { type: 'object', description: 'New account data' },
            accessToken: {
              type: 'string',
              description: 'Bearer token',
              example: '<token>',
            },
            refreshToken: {
              type: 'string',
              description: 'Refresh token',
              example: '<token>',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid password format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiSecurity('access-token')
  @ACCOUNT_SELECT(AccountEnum.ID, AccountEnum.PASSWORD, AccountEnum.IS_ACTIVE)
  @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
  @AUTH(AuthEnum.BEARER)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: AccountResetPasswordDto,
    @ExtractAccountData() account: SafeResetAccountPassword,
  ) {
    this.logger.log('reset password attempt');
    console.log(account);
    return {
      response: await this.authService.resetPassword(resetPasswordDto, account),
    };
  }

  @Post('forgot-password')
  @AUTH(AuthEnum.NONE)
  @ApiOperation({ summary: 'Reset account password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    schema: {
      properties: {
        response: {
          type: 'string',
          description: 'email sent',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiBody({ type: ForgetDto })
  async forgotPassword(@Body() forgetDto: ForgetDto) {
    await this.authService.forgotPassword(forgetDto);
    return { response: 'email sent' };
  }

  @Post('reset-password/:token')
  @AUTH(AuthEnum.NONE)
  @ApiOperation({
    summary: 'Request password reset email',
    description: 'Request password reset email with token',
  })
  @ApiResponse({
    status: 200,
    description: 'Reset email sent',
    schema: {
      properties: {
        response: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'Bearer token',
              example: '<token>',
            },
            refreshToken: {
              type: 'string',
              description: 'Refresh token',
              example: '<token>',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 410, description: 'Token expired' })
  async resetPasswordWithToken(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    this.logger.log('reset password with token attempt');

    return {
      response: await this.authService.resetPasswordWithToken(
        token,
        resetPasswordDto,
      ),
    };
  }

  @AUTH(AuthEnum.NONE)
  @Post('refreshToken')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      properties: {
        response: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'Bearer token',
              example: '<token>',
            },
          },
        },
      },
    },
  })
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    this.logger.log('refresh token attempt');

    return {
      response: await this.authService.refreshToken(refreshToken),
    };
  }
}
