import { Controller, Get, Inject } from '@nestjs/common';
import { Email } from './email';

@Controller('email')
export class EmailController {
  constructor(
    @Inject()
    private readonly emailService: Email,
  ) {}
}
