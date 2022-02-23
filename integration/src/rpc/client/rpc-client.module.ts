import { DynamicModule, Module } from '@nestjs/common';
import { ClientOptions, ClientsModule } from '@nestjs/microservices';

import { RpcClientController } from './rpc-client.controller';

@Module({})
export class RpcClientModule {
  static register(options: ClientOptions): DynamicModule {
    return {
      module: RpcClientModule,
      imports: [ClientsModule.register([{ name: 'RPC-SERVICE', ...options }])],
      controllers: [RpcClientController],
    };
  }
}
