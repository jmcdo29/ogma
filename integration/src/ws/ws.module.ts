import { DynamicModule, Module } from '@nestjs/common';
import { OgmaModule, OgmaModuleOptions } from '@ogma/nestjs-module';

import { AppService } from '../app.service';
import { WsGateway } from './ws.gateway';

@Module({})
export class WsModule {
  static register(options: OgmaModuleOptions): DynamicModule {
    return {
      module: WsModule,
      imports: [OgmaModule.forRoot(options)],
      providers: [WsGateway, AppService],
    };
  }
}
