import {
    CanActivate,
    ExecutionContext,
    GoneException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

// services
import { TokenProvider } from '../providers/token.provider';
import { AccountService } from '../../account/service/account.service';
// dto and interfaces
import { AccountPayloadInterface } from '../interfaces/AccountPayload.interface';
import { AccountEnum } from '../../account/entity/account.enum';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        @Inject() private readonly tokenProvider: TokenProvider,
        @Inject() private readonly accountService: AccountService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractToken(request);
        if (!token)
            throw new UnauthorizedException('You are not authorized to access this resource');

        let payload: AccountPayloadInterface;
        try {
            payload = (await this.tokenProvider.verifyToken<AccountPayloadInterface>(
                token,
                'access',
            )) as AccountPayloadInterface;
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }

        const account = await this.accountService.findById(payload.id);
        if (!account) throw new NotFoundException('Account not found');
        if (!account.is_active) throw new GoneException('Account is not active');
        if (account.has_been_banned) throw new GoneException('Account has been banned');
        request.account = account;
        request.accountId = account.id;
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
