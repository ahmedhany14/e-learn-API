import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Patch,
  Post,
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

@Controller('instructor')
export class InstructorController {
  private readonly logger = new Logger(InstructorController.name);

  constructor(
    @Inject()
    private readonly instructorService: InstructorService,
  ) {}

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

  @ROLE(RoleEnum.INSTRUCTOR)
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
  }
}
