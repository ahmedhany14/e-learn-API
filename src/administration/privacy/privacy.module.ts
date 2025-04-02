import { Module } from '@nestjs/common';
import { PrivacyController } from './privacy.controller';
import { AdminPrivacyService } from './services/admin.privacy.service';
import { AccountModule } from '../../account/account.module';

@Module({
    imports: [AccountModule],
    controllers: [PrivacyController],
    providers: [AdminPrivacyService],
})
export class PrivacyModule {}
