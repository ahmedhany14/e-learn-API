import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  mailHost: process.env.MAILER_HOST,
  mailPort: process.env.MAILER_PORT,
  mailUser: process.env.MAILER_USER,
  mailPassword: process.env.MAILER_PASSWORD,
}));
