import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OgmaModule, OgmaModuleOptions } from '@ogma/nestjs-module';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static forRoot(options: OgmaModuleOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [OgmaModule.forRoot(options)],
    };
  }
}
