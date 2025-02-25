import {
  Injectable,
  OnModuleInit,
  Inject,
  BadRequestException,
  Logger,
} from '@nestjs/common';

// Google Auth
import { OAuth2Client } from 'google-auth-library';

// Config
import { ConfigType } from '@nestjs/config';
import googleConf from 'src/common/config/google.conf';

// DTOs and Interfaces
import { GoogleAuthDto } from '../dto/google.signup.dto';
import { GooglePayload } from '../interfaces/google.payload.interface';

// Providers and Services
import { SignupProvider } from '../providers/transactions/signup.provider';
import { AccountService } from '../../account/service/account.service';
import { TokenProvider } from '../providers/token.provider';

@Injectable()
export class GoogleService implements OnModuleInit {
  private oauth2Client: OAuth2Client;
  private readonly logger = new Logger(GoogleService.name);
  constructor(
    @Inject(googleConf.KEY)
    private readonly googleConfigurations: ConfigType<typeof googleConf>,

    @Inject()
    private readonly signupProvider: SignupProvider,

    @Inject()
    private readonly accountService: AccountService,

    @Inject()
    private readonly tokenProvider: TokenProvider,
  ) {}
  onModuleInit(): any {
    this.oauth2Client = new OAuth2Client({
      clientId: this.googleConfigurations.googleClientId,
      clientSecret: this.googleConfigurations.googleClientSecret,
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
    const account = await this.accountService.findByEmail(googlePayload.email, [
      'id',
      'email',
      'role',
    ]);

    if (account) {
      const { accessToken, refreshToken } =
        await this.tokenProvider.generateToken(account);

      return {
        accessToken,
        refreshToken,
      };
    }

    const { account: create_account } =
      await this.signupProvider.googleSignup(googlePayload);
    const { url } = await this.tokenProvider.generate_active_token(
      create_account.id,
    );

    return url;
  }
}
