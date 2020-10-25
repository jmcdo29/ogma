import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger.module';

@Module({
  imports: [LoggerModule, OgmaModule.forFeature(AppService)],
  controllers: [AppController],
  providers: [AppService],
})
export class NestedModule {}
