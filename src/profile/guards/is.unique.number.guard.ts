import {
    CanActivate,
    ConflictException,
    ExecutionContext,
    Inject,
    Injectable,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service';

@Injectable()
export class IsUniqueNumberGuard implements CanActivate {
    constructor(@Inject() private readonly profileService: ProfileService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest(),
            { phone_number } = request.body,
            accountId: number = request.accountId;
        if (!phone_number) return true;

        const sameProfileWithNumber = await this.profileService.findByPhoneNumber(phone_number);

        if (sameProfileWithNumber && sameProfileWithNumber.account.id !== accountId) {
            throw new ConflictException({
                message: 'Phone number already exists',
                details: `The phone number ${phone_number} already exists, please use another one`,
            });
        }

        return true;
    }
}
