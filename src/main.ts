import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { StartTimeMiddleware } from './common/middleware/start.time.middleware';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';

// const cluster = require('cluster');
// const os = require('os');
//
// const numCPUs = os.cpus().length;
// process.env.UV_THREADPOOL_SIZE = '1';
// if (cluster.isPrimary) {
//   console.log(`Master ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     console.log(`Forking process number ${i}...`);
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
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
  app.use(
    helmet({
      xssFilter: true, // Prevents attempts to inject malicious JavaScript code (XSS) into the application
      frameguard: {
        // Prevents the application from being displayed inside an iframe, which protects against clickjacking attacks
        action: 'deny',
      },
      noSniff: true, // Protects against MIME sniffing attempts, making the browser rely solely on the
      contentSecurityPolicy: {
        // Helps define which content sources (such as scripts and images) are allowed, increasing security by restricting potentially harmful external content
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'trusted.com'],
        },
      },
    }),
  );
  app.use(compression()); // Enable response compression, reducing the size of the response body
  app.use(bodyParser.json()); // Enable JSON body parsing
  app.use(bodyParser.urlencoded({ extended: true })); // Enable URL-encoded body parsing
  app.use(morgan('combined')); // Enable request logging
  app.enableCors({
    // origin: '*',
    // methods: 'GET,HEAD,PUT,PATCH, POST, DELETE',
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
    // credentials: true,
  });

  // swagger
  const config = new DocumentBuilder()
    .setVersion(process.env.API_VERSION ?? 'v1.0.0')
    .setTitle('e-learning platform API')
    .setDescription('The e-learning platform API description')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`)
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Please enter token with Bearer prefix',
      },
      'Authorization',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().then(() => {
  console.log(
    `
Server is running on http://localhost:${process.env.PORT ?? 3000}
to see the API documentation visit http://localhost:${process.env.PORT ?? 3000}/api
    `,
  );
});
// }
