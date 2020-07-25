import { Module } from '@nestjs/common';
import { OgmaModule } from '../src';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      interceptor: false,
    }),
    OgmaModule.forFeature(AppService),
  ],
  providers: [AppService],
})
export class AppModule {}
