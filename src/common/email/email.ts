import { Injectable, Logger } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { Profile } from '../../profile/entity/profile.entity';

@Injectable()
export class Email {
  private readonly logger = new Logger(Email.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(email: string, profile: Profile, token: string) {
    this.logger.log(`Sending welcome email to ${email}`);

    await this.mailerService
      .sendMail({
        from: `"Onboarding Team" <${this.configService.get('email.mailUser')}>`,
        to: email,
        subject: 'Welcome to our platform',
        template: './welcome',
        context: {
          username: `${profile.firstName} ${profile.lastName}`,
          email: email,
          loginUrl: 'http://localhost:3000/auth/sign',
        },
        text: `
            Hello ${profile.firstName},
            
            Welcome to our platform! Click the link below to access your profile:
            http://localhost:3000/profile/${profile.id}
            
            Best regards,
            The Team
      `,
        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #4CAF50;">Hello, ${profile.firstName}!</h1>
                <p>Welcome to our platform! We're thrilled to have you on board.</p>
                
                <p>Click the button below to access your profile:</p>
                
                <div style="margin: 20px 0; text-align: center;">
                  <a 
                    href="http://localhost:3000/profile?profileId=${profile.id}"
                    style="
                      background-color: #4CAF50;
                      color: white;
                      text-decoration: none;
                      padding: 10px 20px;
                      font-size: 16px;
                      border-radius: 5px;
                      display: inline-block;
                      font-weight: bold;
                    ">
                    Access My Profile
                  </a>
                </div>
                
                <p style="font-size: 12px; color: #777;">If you face any issues, feel free to contact our support team.</p>
                <p style="font-size: 12px; color: #777;">Best regards,<br />The Team</p>
              </div>
        `,
      })
      .then(() => {
        this.logger.log(`Email sent to ${email}`);
      })
      .catch((error) => {
        this.logger.error(`Error sending email to ${email}: ${error}`);
      });
  }
}
