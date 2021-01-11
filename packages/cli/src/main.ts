#!/usr/bin/env node
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommandService } from './command.service';

async function bootstrap(...args: string[]) {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(CommandService);
  await service.act(args);
  await app.close();
}

const [, , ...args] = process.argv;

bootstrap(...args).catch((err) => {
  process.stderr.write(err.message);
  process.stderr.write(err.stack);
  process.exit(1);
});
