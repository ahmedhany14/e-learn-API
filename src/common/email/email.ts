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

  async sendWelcomeEmail(email: string, token: string) {
    this.logger.log(`Sending welcome email to ${email}`);

    const loginUrl = `http://localhost:3000/auth/sign?token=${token}`;

    await this.mailerService
      .sendMail({
        from: `"Onboarding Team" <${this.configService.get('email.mailUser')}>`,
        to: email,
        subject: 'Welcome to our platform',
        text: `
        Hello,

        Welcome to our platform! Click the link below to sign in:

        ${loginUrl}

        Best regards,
        The Team
      `,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #4CAF50;">Welcome!</h1>
          <p>We're thrilled to have you on board.</p>
          
          <p>Click the button below to sign in:</p>
          
          <div style="margin: 20px 0; text-align: center;">
            <a 
              href="${loginUrl}"
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
              Sign In
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

  async sendResetPasswordEmail(email: string, token: string) {
    this.logger.log(`Sending reset password email to ${email}`);

    await this.mailerService
      .sendMail({
        from: `"Onboarding Team" <${this.configService.get('email.mailUser')}>`,
        to: email,
        subject: 'Reset your password',
        template: './reset-password',
        context: {
          email: email,
          resetUrl: `http://localhost:3000/auth/reset-password?token=${token}`,
        },
        text: `
            Hello,
            
            You've requested to reset your password. Click the link below to reset it:
            http://localhost:3000/auth/reset-password?token=${token}
            
            Best regards,
            The Team
      `,
        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #4CAF50;">Hello!</h1>
                <p>You've requested to reset your password. Click the button below to reset it:</p>
                
                <div style="margin: 20px 0; text-align: center;">
                  <a 
                    href="http://localhost:3000/auth/reset-password/${token}"
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
                    Reset My Password
                  </a>
                </div>
                
                <p style="font-size: 12px; color: #777;">If you didn't request this, you can safely ignore this email.</p>
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

  async sendOrderConfirmationEmail(email: string, orderId: number) {
    this.logger.log(`Sending order confirmation email to ${email}`);

    await this.mailerService
      .sendMail({
        from: `"Onboarding Team" <${this.configService.get('email.mailUser')}>`,
        to: email,
        subject: 'Order Confirmation',
        template: './order-confirmation',
        context: {
          email: email,
          orderId: orderId,
        },
        text: `
            Hello,
            
            Your order has been received. Your order ID is: ${orderId}.
            
            Best regards,
            The Team
      `,
        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #4CAF50;">Hello!</h1>
                <p>Your order has been received. Your order ID is: ${orderId}.</p>
                
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

  async sendApprovedEmail(orderId: number, email: string) {
    this.logger.log(`Sending approved email for order ${orderId}`);

    await this.mailerService
      .sendMail({
        from: `"Onboarding Team" <${this.configService.get('email.mailUser')}>`,
        to: email,
        subject: 'Order Approved',
        template: './order-approved',
        context: {
          email: email,
          orderId: orderId,
        },
        text: `
            Hello,
            
            Your order has been approved. Your order ID is: ${orderId}.
            
            Best regards,
            The Team
      `,
        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #4CAF50;">Hello!</h1>
                <p>Your order has been approved. Your order ID is: ${orderId}.</p>
                
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

  async sendRejectedEmail(orderId: number, email: string) {
    this.logger.log(`Sending rejected email for order ${orderId}`);

    await this.mailerService
      .sendMail({
        from: `"Onboarding Team" <${this.configService.get('email.mailUser')}>`,
        to: email,
        subject: 'Order Rejected',
        template: './order-rejected',
        context: {
          email: email,
          orderId: orderId,
        },
        text: `
            Hello,
            
            Your order has been rejected. Your order ID is: ${orderId}.
            
            Best regards,
            The Team
      `,
        html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #4CAF50;">Hello!</h1>
                <p>Your order has been rejected. Your order ID is: ${orderId}.</p>
                
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
