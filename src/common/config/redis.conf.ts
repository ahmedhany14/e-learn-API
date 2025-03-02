import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  port: parseInt(process.env.REDIS_PORT, 10),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PW,

  // expiration time in seconds
  active_token_expiration: parseInt(process.env.REDIS_ACTIVE_TOKEN_EXPIRATION, 10) || 5 * 60, // 5 minutes
}));
