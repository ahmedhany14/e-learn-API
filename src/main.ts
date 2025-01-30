import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { StartTimeMiddleware } from './common/middleware/start.time.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(new StartTimeMiddleware().use);

  app.enableCors({
    // origin: '*',
    // methods: 'GET,HEAD,PUT,PATCH, POST, DELETE',
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
    // credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then(() => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT ?? 3000}`,
  );
});
