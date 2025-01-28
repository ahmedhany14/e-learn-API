import { Module } from '@nestjs/common';

// Mailer
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

// providers
import { Email } from './email';

// config
import { ConfigService } from '@nestjs/config';

import { join } from 'path';
import { EmailController } from './email.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('email.mailHost'),
          port: configService.get<number>('email.mailPort'),
          secure: false,
          auth: {
            user: configService.get(<string>'email.mailUser'),
            pass: configService.get<string>('email.mailPassword'),
          },
          defaults: {
            from: `"No Reply" <${configService.get<string>('email.mailUser')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter({
              inlineCssEnabled: true, // inline your css
            }),
            options: {
              strict: false,
            },
          },
          debug: true,
          logger: true,
          connectionTimeout: 5000,
          greetingTimeout: 5000,
        },
      }),
    }),
  ],
  providers: [Email],
  exports: [Email],
  controllers: [EmailController],
})
export class EmailModule {}
