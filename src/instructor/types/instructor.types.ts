import { PickType } from '@nestjs/mapped-types';
import { Instructor } from '../entity/instructor.entity';

export class SafePaymentInfo extends PickType(Instructor, [
  'payment_info',
  'stripe_info',
]) {
  payment_info: string;
  stripe_info: string;

  constructor(instructor: Instructor) {
    super();
    this.payment_info = instructor.payment_info;
    this.stripe_info = instructor.stripe_info;
  }
}
