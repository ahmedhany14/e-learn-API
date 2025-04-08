import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { EnrollCoursesService } from 'src/payments/modules/enroll-courses/services/enroll-courses.service';

@Injectable()
export class IsEnrolledGuard implements CanActivate {
    constructor(
        @Inject()
        private readonly enrollCoursesService: EnrollCoursesService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const course_id = request.params.course_id;
        const account_id = request.accountId;

        const isEnrolled = await this.enrollCoursesService.findOne({
            course: {
                id: course_id,
            },
            account: {
                id: account_id,
            },
        });

        request.isEnrolled = !!isEnrolled;

        return true;
    }
}
