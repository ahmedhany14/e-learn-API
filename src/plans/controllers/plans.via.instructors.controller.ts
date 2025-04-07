import {
    Controller,
    Inject,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';

// guards
import { IsYourCourseGuard } from '../../courses/guards/is.your.course.guard';

// auth decorators
import { AUTH } from '@app/decorators';
import { ROLE } from '@app/decorators';
import { AuthEnum } from '@app/enums';
import { RoleEnum } from '@app/enums';

// service
import { PlanRepository } from '../repository/plan.repo';
import { PlansViaInstructorsService } from '../service/plans.via.instructors.service';

@Controller('plans-via-instructors')
export class PlansViaInstructorsController {
    constructor(
        @Inject()
        private readonly planRepository: PlanRepository,
        @Inject()
        private readonly plansViaInstructorsService: PlansViaInstructorsService,
    ) {}

    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Post('add-plan/:plan_id/:course_id')
    async addPlanToCourse(
        @Param('plan_id', ParseIntPipe) plan_id: number,
        @Param('course_id', ParseIntPipe) course_id: number,
    ) {
        const plan = await this.planRepository.findOne({ id: plan_id });
        if (!plan) {
            throw new NotFoundException({
                message: 'Plan not found',
            });
        }

        const course_plan = await this.plansViaInstructorsService.create(
            this.plansViaInstructorsService.newCoursePlan(plan_id, course_id),
        );

        return {
            response: {
                message: 'Plan added to course successfully',
                course_plan,
            },
        };
    }

    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Post('remove-plan/:plan_id/:course_id')
    async removePlanFromCourse(
        @Param('plan_id', ParseIntPipe) plan_id: number,
        @Param('course_id', ParseIntPipe) course_id: number,
    ) {
        await this.plansViaInstructorsService.findOneAndDelete({
            plan: { id: plan_id },
            course: { id: course_id },
        });

        return {
            response: 'Plan removed from course successfully',
        };
    }
}
