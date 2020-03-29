import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { OgmaService } from '@ogma/nestjs-module';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const logger = app.get(OgmaService);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  logger.log(`Nest-Fastify listening at ${await app.getUrl()}`);
}

bootstrap();
