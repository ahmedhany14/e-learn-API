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
import { GoogleService } from './strategies/google.service';

// dto and interfaces
import { AccountLoginDto } from './dto/account.login.dto';
import { AccountSignupDto } from './dto/account.signup.dto';
import { RefreshTokenDto } from './dto/refresh_token.dto';
import { AccountResetPasswordDto } from './dto/account.reset-password.dto';
import { ForgetDto } from './dto/forget.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import { GoogleAuthDto } from './dto/google.signup.dto';

// decorators and types
import { AUTH } from './decorators/auth.decorator';
import { ROLE } from './decorators/role.decorator';
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';
import { RoleEnum } from './enums/role.enum';
import { AuthEnum } from './enums/auth.enum';

// interfaces
import { SafeResetAccountPassword } from '../account/interfaces/accounts.interface';
import { GooglePayload } from './interfaces/google.payload.interface';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        @Inject() private readonly authService: AuthService,
        @Inject() private readonly googleService: GoogleService,
    ) {}

    @AUTH(AuthEnum.NONE)
    @Post('sign-in')
    async login(@Body() accountLoginDto: AccountLoginDto) {
        this.logger.log('login attempt');

        return { response: await this.authService.login(accountLoginDto) };
    }

    @AUTH(AuthEnum.NONE)
    @Post('sign-up')
    async signUp(@Body() accountSignupDto: AccountSignupDto) {
        this.logger.log('sign up attempt');

        const url = await this.authService.signUp(accountSignupDto);
        //await this.email.sendActiveEmail(accountSignupDto.email, url);

        return {
            response: {
                message: 'Account created successfully',
                url,
            },
        };
    }

    @Post('google-sign-up')
    async googleSignUp(@Body() googleAuthDto: GoogleAuthDto) {
        this.logger.log('google sign up attempt');

        const payload = await this.googleService.verifyGoogleToken(googleAuthDto);

        const account: GooglePayload = {
            email: payload.email || '',
            first_name: payload.given_name || '',
            last_name: payload.family_name || '',
            img_url: payload.picture || '',
        };

        const response = await this.googleService.googleSignUp(account);

        //await this.email.sendActiveEmail(accountSignupDto.email, url);

        return {
            response,
        };
    }

    @ROLE(RoleEnum.INSTRUCTOR, RoleEnum.USER, RoleEnum.ADMIN)
    @AUTH(AuthEnum.BEARER)
    @Post('sign-out')
    async signOut() {
        /*
         Not implemented yet
         */

        return { response: 'Sign out' };
    }

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
    async forgotPassword(@Body() forgetDto: ForgetDto) {
        const reset_token = await this.authService.forgotPassword(forgetDto);
        return {
            response: {
                message: 'email sent',
                reset_token,
            },
        };
    }

    @Post('reset-password/:token')
    @AUTH(AuthEnum.NONE)
    async resetPasswordWithToken(
        @Param('token') token: string,
        @Body() resetPasswordDto: ResetPasswordDto,
    ) {
        this.logger.log('reset password with token attempt');

        return {
            response: await this.authService.resetPasswordWithToken(token, resetPasswordDto),
        };
    }

    @AUTH(AuthEnum.NONE)
    @Post('refreshToken')
    async refreshToken(@Body() refreshToken: RefreshTokenDto) {
        this.logger.log('refresh token attempt');

        return {
            response: await this.authService.refreshToken(refreshToken),
        };
    }
}
