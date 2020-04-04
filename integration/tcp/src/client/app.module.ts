import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OgmaModule } from '@ogma/nestjs-module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
    ]),
    OgmaModule.forRoot({
      interceptor: false,
    }),
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
