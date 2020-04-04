import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OgmaService } from '@ogma/nestjs-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(OgmaService);
  await app.listen(3000);
  logger.log(`TCP Microservice client listening at ${await app.getUrl()}`);
}

bootstrap();
