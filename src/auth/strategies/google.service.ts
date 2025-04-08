import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';

// Google Auth
import { OAuth2Client } from 'google-auth-library';

// DTOs and Interfaces
import { GoogleAuthDto } from '../dto/google.signup.dto';
import { GooglePayload } from '../interfaces/google.payload.interface';

// Providers and Services
import { SignupProvider } from '../providers/transactions/signup.provider';
import { AccountService } from '../../account/service/account.service';
import { TokenProvider } from '../providers/token.provider';
import { ConfigService } from '@app/configurations';

@Injectable()
export class GoogleService implements OnModuleInit {
    private oauth2Client: OAuth2Client;
    private readonly logger = new Logger(GoogleService.name);

    constructor(
        @Inject()
        private readonly signupProvider: SignupProvider,
        @Inject()
        private readonly accountService: AccountService,
        @Inject()
        private readonly tokenProvider: TokenProvider,
        @Inject()
        private readonly configService: ConfigService,
    ) {}

    onModuleInit(): any {
        this.oauth2Client = new OAuth2Client({
            clientId: this.configService.googleConfig.googleClientId,
            clientSecret: this.configService.googleConfig.googleClientSecret,
        });
    }

    async verifyGoogleToken(googleAuthDto: GoogleAuthDto) {
        const ticket = await this.oauth2Client.verifyIdToken({
            idToken: googleAuthDto.googleToken,
        });

        this.logger.log('ticket payload', ticket.getPayload());

        return ticket.getPayload();
    }

    async googleSignUp(googlePayload: GooglePayload) {
        const account = await this.accountService.findByEmail({ email: googlePayload.email });

        if (account) {
            const { accessToken, refreshToken } = await this.tokenProvider.generateToken(account);

            return {
                accessToken,
                refreshToken,
            };
        }

        const { account: create_account } = await this.signupProvider.googleSignup(googlePayload);
        const { url } = await this.tokenProvider.generate_active_token(create_account.id);

        return url;
    }
}
