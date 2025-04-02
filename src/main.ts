import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  const openApiDocPath = `${globalPrefix}/doc`;

  app.setGlobalPrefix(globalPrefix);

  const serverUrl = process.env.SERVER_URL || 'http://localhost';
  const port = process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('CQRS API')
    .setDescription('CQRS API for Book Management')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(openApiDocPath, app, document);

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: ${serverUrl}:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🚀 Swagger UI is running on: ${serverUrl}:${port}/${openApiDocPath} - Openapi Spec could found on: ${serverUrl}:${port}/${openApiDocPath}-yaml or ${serverUrl}:${port}/${openApiDocPath}-json`,
  );
}
bootstrap();
