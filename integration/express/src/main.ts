import { NestFactory } from '@nestjs/core';
import { OgmaService } from '@ogma/nestjs-module';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(OgmaService);
  await app.listen(process.env.POR || 3000);
  logger.log(`Nest-Express listening at ${await app.getUrl()}`);
}

bootstrap();
