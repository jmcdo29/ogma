import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forFeatures([AppService, AppController]),
    OgmaModule.forRoot({
      service: {
        application: 'forFeatures',
      },
      interceptor: false,
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class ForFeatsModule {}
