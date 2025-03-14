import { Module } from '@nestjs/common';

// Modules
import { PrivacyModule } from './privacy/privacy.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReviewCoursesModule } from './review-courses/review-courses.module';

@Module({
    imports: [PrivacyModule, DashboardModule, ReviewCoursesModule],
})
export class AdministrationModule {}
