import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { StartTimeMiddleware } from './common/middleware/start.time.middleware';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

import helmet from "helmet";

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
  app.use(helmet({
    xssFilter: true, // Prevents attempts to inject malicious JavaScript code (XSS) into the application
    frameguard: { // Prevents the application from being displayed inside an iframe, which protects against clickjacking attacks
      action: 'deny',
    },
    noSniff: true, // Protects against MIME sniffing attempts, making the browser rely solely on the
    contentSecurityPolicy: { // Helps define which content sources (such as scripts and images) are allowed, increasing security by restricting potentially harmful external content
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted.com"],
      },
    },
  }))
  app.use(compression());  // Enable response compression, reducing the size of the response body
  app.use(bodyParser.json());  // Enable JSON body parsing
  app.use(bodyParser.urlencoded({ extended: true }));  // Enable URL-encoded body parsing
  app.use(morgan('combined'));  // Enable request logging
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
