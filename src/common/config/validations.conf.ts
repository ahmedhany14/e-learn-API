import * as Joi from 'joi';

export default Joi.object({
  // app configurations validation
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_VERSION: Joi.string().default('v1'),

  // database configurations validation
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().required(),
  DATABASE_AUTO_LOAD_ENTITIES: Joi.boolean().required(),

  // jwt configurations validation
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.number().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),

  // email configurations validation
  MAILER_HOST: Joi.string().required(),
  MAILER_PORT: Joi.number().port().required(),
  MAILER_USER: Joi.string().required(),
  MAILER_PASSWORD: Joi.string().required(),

  // reset token configurations validation
  RESET_TOKEN_EXPIRES_IN: Joi.number().required().default(300),
  RESET_TOKEN_SECRET: Joi.string().required(),

  // redis configurations validation
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PW: Joi.string().required(),
});
