import { Module } from '@nestjs/common';
import { PrivacyModule } from './privacy/privacy.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrivacyModule, DashboardModule]
})
export class AdministrationModule {}
