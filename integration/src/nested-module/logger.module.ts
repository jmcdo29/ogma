import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';

@Module({
  imports: [
    OgmaModule.forRoot({
      service: {
        application: 'NestedModule',
      },
      interceptor: false,
    }),
  ],
})
export class LoggerModule {}
