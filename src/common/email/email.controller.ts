import { Controller, Get, Inject } from '@nestjs/common';
import { Email } from './email';

@Controller('email')
export class EmailController {
  constructor(
    @Inject()
    private readonly emailService: Email,
  ) {}

  @Get('test-email')
  async send() {
    await this.emailService.sendWelcomeEmail(
      'ahmedhany14.work@gmail.com',
      'Ahmed Hany',
    );
    return 'Email sent';
  }
}
