import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { SocketioParser } from '@ogma/platform-socket.io';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      interceptor: {
        ws: SocketioParser,
      },
    }),
  ],
  providers: [AppGateway, AppService],
})
export class AppModule {}
