import {
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  UseFilters,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ExceptionFilter } from './exception.filter';

@Controller()
export class KafkaClientController implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    ['hello', 'error', 'skip'].forEach((key) =>
      this.kafka.subscribeToResponseOf(`say.${key}`),
    );
  }

  onModuleDestroy() {
    this.kafka.close();
  }

  @Get()
  sayHello() {
    return this.kafka.send('say.hello', { ip: '127.0.0.1' });
  }

  @Get('error')
  @UseFilters(ExceptionFilter)
  sayError() {
    return this.kafka.send('say.error', { ip: '127.0.0.1' });
  }

  @Get('skip')
  saySkip() {
    return this.kafka.send('say.skip', { ip: '127.0.0.1' });
  }
}
