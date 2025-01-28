import { Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Email {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService
      .sendMail({
        from: `"Onboarding Team" <${this.configService.get('email.mailUser')}>`,
        to: email,
        subject: 'Welcome to our platform',
        template: './welcome',
        context: {
          username: name,
          email: email,
          loginUrl: 'http://localhost:3000/auth/sign',
        },
        text: `Hello ${name}, Welcome to our platform! Visit us at http://localhost:3000/auth/sign-in.`,
        html: `<h1>Hello ${name}</h1><p>Welcome to our platform! Visit us at <a href="http://localhost:3000/auth/sign">Login</a>.</p>`,
      })
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error('Error sending email', error);
      });
  }
}
