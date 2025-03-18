import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Middleware
  // app.use(LoggerMiddleware);

  // Enable JSON Parsing
  app.use(json());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}`);
}
bootstrap();
