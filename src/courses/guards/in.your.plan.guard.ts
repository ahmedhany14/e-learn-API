import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';

// services
import { SubscriptionsService } from 'src/payments/modules/subscriptions/subscriptions.service';
import { PlansViaInstructorsService } from 'src/plans/service/plans.via.instructors.service';

@Injectable()
export class InYourPlanGuard implements CanActivate {

    constructor(
        @Inject()
        private readonly PlansViaInstructorsService: PlansViaInstructorsService,

        @Inject()
        private readonly subscriptionsService: SubscriptionsService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const course_id = request.params.course_id;
        const account_id = request.accountId;
        // get active account plans
        const accountPlans = await this.getActiveAccountPlans(account_id);

        const isInYourPlan = await this.isInYourPlans(course_id, accountPlans);

        request.isInYourPlan = isInYourPlan;

        return true;
    }

    private async isInYourPlans(course_id: number, accountPlans): Promise<boolean> {

        for (const plan of accountPlans) {
            const coursePlans = await this.PlansViaInstructorsService.findOne({
                plan: {
                    id: plan.plan.id
                },
                course: {
                    id: course_id
                }
            });

            if (coursePlans)
                return true;
        }
        return false;
    }

    private async getActiveAccountPlans(account_id: number) {
        const accountPlans = await this.subscriptionsService.find({
            account: {
                id: account_id
            },
        });

        // filter active plans
        const activeAccountPlans = accountPlans.filter((plan) => {
            const now = new Date();
            return plan.start_at <= now && plan.end_at >= now;
        });

        return activeAccountPlans;
    }
}
