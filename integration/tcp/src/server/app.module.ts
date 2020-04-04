import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { TcpParser } from '@ogma/platform-tcp';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      interceptor: {
        rpc: TcpParser,
      },
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
