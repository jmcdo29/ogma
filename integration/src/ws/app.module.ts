import { Module } from '@nestjs/common';
import { AppService } from '../app.service';
import { AppGateway } from './app.gateway';

@Module({
  providers: [AppGateway, AppService],
})
export class AppModule {}
