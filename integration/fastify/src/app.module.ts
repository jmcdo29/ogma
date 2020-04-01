import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { FastifyParser } from '@ogma/platform-fastify';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      interceptor: {
        http: FastifyParser,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
