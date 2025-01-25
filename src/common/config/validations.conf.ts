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
});
