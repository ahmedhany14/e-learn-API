import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  port: parseInt(process.env.REDIS_PORT, 10),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PW,
}));
