import { Module } from '@nestjs/common';
import { AppService } from '../../app.service';
import { KafkaServerController } from './kafka-server.controller';

@Module({
  controllers: [KafkaServerController],
  providers: [AppService],
})
export class KafkaServerModule {}
