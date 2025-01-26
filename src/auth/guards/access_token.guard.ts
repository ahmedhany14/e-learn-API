import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

// services
import { TokenProvider } from '../providers/token.provider';

// dto and interfaces
import { AccountPayloadInterface } from '../interfaces/AccountPayload.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(@Inject() private readonly tokenProvider: TokenProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);
    if (!token)
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );

    console.log('token', token);

    try {
      await this.tokenProvider.verifyToken<AccountPayloadInterface>(
        token,
        'access',
      );
    } catch (e) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    return true;
  }

  private extractToken(request: Request) {
    const authorization = request.headers['authorization'];
    if (!authorization) return null;
    const parts = authorization.split(' ');
    if (parts.length !== 2) return null;
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) return null;
    return token;
  }
}
