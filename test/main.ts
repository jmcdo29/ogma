import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
  });
  if (process.argv[2] === 'ws') {
    app.useWebSocketAdapter(new WsAdapter(app));
  }
  await app.startAllMicroservicesAsync();
  await app.listen(3001);
}

bootstrap();
