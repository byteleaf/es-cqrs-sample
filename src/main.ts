import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  const serverUrl = process.env.SERVER_URL || 'http://localhost';
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: ${serverUrl}:${port}/${globalPrefix}`,
  );
}
bootstrap();
