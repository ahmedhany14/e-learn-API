import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

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
import { UpdatePaymentsDto } from './dtos/update.payments.dto';
import { QueryDto } from './dtos/my.courses.query.dto';
import { IsYourCourseGuard } from './guards/is.your.course.guard';
import { ExtractCourseDate } from 'src/common/decorators/request.extractCourseDate.decorator';
import { CourseService } from 'src/courses/service/course.service';
import { ObjectIdValidationPipe } from 'src/blog-system/blog/validators/object.id.validation.pipe';
import { UpdateCourseDto } from './dtos/update.course.dto';
import { AddCourseSectionsDto } from './dtos/add.course.sections.dto';
import { AddVideoDto } from './dtos/add.video.dto';
import { SectionsService } from 'src/courses/service/sections.service';

@Controller('instructor')
export class InstructorController {
  private readonly logger = new Logger(InstructorController.name);

  constructor(
    @Inject()
    private readonly instructorService: InstructorService,

    @Inject()
    private readonly courseService: CourseService,

    @Inject()
    private readonly sectionService: SectionsService
  ) { }

  @UseGuards(IsYourCourseGuard)
  @ROLE(RoleEnum.INSTRUCTOR)
  @AUTH(AuthEnum.BEARER)
  @Patch('add-video/:course_id')
  async addVideo(
    @Param('course_id', ObjectIdValidationPipe) course_id: string,
    @Body() addVideoDto: AddVideoDto,
  ) {
    //const course = await this.courseService.addVideo(course_id, addVideoDto);

    return {
      response: {
        message: 'Video added successfully',
        //  data: course,
      },
    };
  }

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
