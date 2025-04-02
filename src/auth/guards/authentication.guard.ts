import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

// Reflect Metadata
import { Reflector } from '@nestjs/core';

// Guards
import { AccessTokenGuard } from './access_token.guard';

// types and constants
import { AUTH_TYPE_KEY } from '../../common/constants/auth.constants';
import { AuthEnum } from '../enums/auth.enum';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authTypeMap = new Map();
  private static readonly defaultAuthType = AuthEnum.NONE;

  constructor(
    @Inject()
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly reflector: Reflector,
  ) {
    this.authTypeMap.set(AuthEnum.BEARER, this.accessTokenGuard);
    this.authTypeMap.set(AuthEnum.NONE, { canActivate: () => true });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthEnum[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()], // get the metadata from the handler or the class
    ) ?? [AuthenticationGuard.defaultAuthType]; // if there is no metadata, use the default auth type

    // get guard based on the auth type
    const guards = authTypes.map((authType) => this.authTypeMap.get(authType));

    let defaultError = new UnauthorizedException(
      'You are not authorized to access this resource',
    );

    // iterate through the guards and check if the user is authorized
    for (const guard of guards) {
      const canActivate = await Promise.resolve(
        guard.canActivate(context),
      ).catch((err) => (defaultError = err));

      if (canActivate === true) return true; // if any of the guards return true, then the user is authorized and we can return true
    }

    throw defaultError;
  }
}
