import { Controller, Get, Inject, Logger, UseGuards } from '@nestjs/common';

// Auth and role decorators
import { ROLE } from '../auth/decorators/role.decorator';
import { AUTH } from '../auth/decorators/auth.decorator';
import { AuthEnum } from '../auth/enums/auth.enum';
import { RoleEnum } from '../auth/enums/role.enum';

// decorators
import { ExtractAccountData } from '../common/decorators/request.extractData.decorator';

// services and providers
import { InstructorService } from './services/instructor.service';

//safe types
import { SafePaymentInfo } from './types/instructor.types';

// dto
import { IsYourCourseGuard } from './guards/is.your.course.guard';
import { ExtractCourseDate } from 'src/common/decorators/request.extractCourseDate.decorator';
import { CourseService } from 'src/courses/service/course.service';
import { SectionsInstructorService } from 'src/sections/services/instructor/sections.instructor.service';

@Controller('instructor')
export class InstructorController {
    private readonly logger = new Logger(InstructorController.name);

    constructor(
        @Inject()
        private readonly instructorService: InstructorService,
    ) { }

    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    @Get('my-payments')
    async getPayments(@ExtractAccountData('id') account_id: number) {
        this.logger.log(`Getting payments for account_id: ${account_id}`);

        const payments = new SafePaymentInfo(
            await this.instructorService.getPayments(account_id),
        );

        return {
            response: payments,
        };
    }

    /*  @ROLE(RoleEnum.INSTRUCTOR)
              @AUTH(AuthEnum.BEARER)
              @Patch('edit-payments')
              async updatePayments(
                  @ExtractAccountData('id') account_id: number,
                  @Body() updatePaymentsDto: UpdatePaymentsDto,
              ) {
                  if (Object.keys(updatePaymentsDto).length === 0) {
                      return {
                          response: 'No data provided to update',
                      };
                  }
          
                  await this.instructorService.updatePayments(account_id, updatePaymentsDto);
          
                  return {
                      response: 'Payments updated successfully',
                  };
              }*/

    @Get('push-course-to-review/:course_id')
    @UseGuards(IsYourCourseGuard)
    @ROLE(RoleEnum.INSTRUCTOR)
    @AUTH(AuthEnum.BEARER)
    async pushCourseToBeReviewed(@ExtractCourseDate('id') course_id: number) {
        this.logger.log(`Pushing course with id: ${course_id} for review`);
        const review = await this.instructorService.pushCourseForReview(course_id);

        return {
            response: `Course with id: ${course_id} has been pushed for review, with review id: ${review.id}`,
        };
    }
}
