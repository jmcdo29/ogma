import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OgmaService } from '@ogma/nestjs-module';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001,
      },
    },
  );
  const logger = app.get(OgmaService);
  await app.listenAsync();
  logger.log(`Microservice server listening at port 3001`);
}

bootstrap();
