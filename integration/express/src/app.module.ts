import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { ExpressInterceptorParser } from '@ogma/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      interceptor: {
        http: ExpressInterceptorParser,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
