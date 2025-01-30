import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
  refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN ?? '86000', 10),
  tokenAudience: process.env.JWT_TOKEN_AUDIENCE,
  tokenIssuer: process.env.JWT_TOKEN_ISSUER,
  reset_token_expires_in: parseInt(process.env.RESET_TOKEN_EXPIRES_IN ?? '300', 10),
  reset_token_secret: process.env.RESET_TOKEN_SECRET,
}));
