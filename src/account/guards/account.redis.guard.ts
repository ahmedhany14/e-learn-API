import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountRedisService } from '../../redis/services/account.redis.service';

@Injectable()
export class TokenIsInRedisGuard implements CanActivate {
  constructor(private readonly accountRedisService: AccountRedisService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request || !request.params) {
      throw new UnauthorizedException('Invalid request format.');
    }

    const id = Number(request.params.account_id);
    const token = request.params.token;

    if (!id || !token) {
      throw new UnauthorizedException('ID or Token is missing.');
    }
    const activeToken = await this.accountRedisService.getActiveToken(id);
    console.log(activeToken);
    console.log(token);
    console.log(id);
    if (!activeToken) {
      throw new UnauthorizedException({
        message: `Can't activate account`,
        details: `Token expired or not found`,
      });
    }

    if (activeToken.token !== token || activeToken.id !== id.toString()) {
      throw new UnauthorizedException({
        message: `Can't activate account`,
        details: `Token does not match`,
      });
    }

    return true;
  }
}
