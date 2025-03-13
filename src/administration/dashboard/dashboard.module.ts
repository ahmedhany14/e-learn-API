import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';

// modules
import {CoursesModule} from "../../courses/courses.module";
import {AccountModule} from "../../account/account.module";

@Module({
    imports: [
      CoursesModule,
      AccountModule,
    ],
    controllers: [DashboardController],
})
export class DashboardModule {}
