import { Module } from '@nestjs/common';

// Mailer
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

// providers
import { Email } from './email';

// config
import { ConfigService } from '../../configurations/config.service';
import { ConfigurationsModule } from '../../configurations/configurations.module';

import { join } from 'path';
import { EmailController } from './email.controller';
import * as console from 'node:console';

@Module({
  imports: [
    ConfigurationsModule,
    MailerModule.forRootAsync({
	    imports: [ConfigurationsModule],
	    inject: [ConfigService],
      useFactory: (configService: ConfigService) => (
				{

        transport: {
          host: configService.emailConfig.mailHost,
          port: configService.emailConfig.mailPort,
          secure: false,
          auth: {
            user: configService.emailConfig.mailUser,
            pass: configService.emailConfig.mailPassword,
          },
          defaults: {
            from: `"No Reply" <${configService.emailConfig.mailUser}>`,
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
          // debug: true,
          // logger: true,
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
