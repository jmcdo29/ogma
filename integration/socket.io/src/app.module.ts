import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { SocketioInterceptorParser } from '@ogma/platform-socket.io';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      interceptor: {
        ws: SocketioInterceptorParser,
      },
    }),
  ],
  providers: [AppGateway, AppService],
})
export class AppModule {}
