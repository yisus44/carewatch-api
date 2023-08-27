import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import rawBodyMiddleware from './common/middleware/rawBody.middleware';

import { mapSSMtoEnv } from './map-ssm-to-env';

async function bootstrap() {
  await mapSSMtoEnv();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();
  app.use(rawBodyMiddleware());
  await app.listen(3000);
}
bootstrap();
