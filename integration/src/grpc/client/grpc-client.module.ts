import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { GrpcClientController } from './grpc-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.GRPC,
        name: 'GRPC_SERVICE',
        options: {
          package: 'hello',
          protoPath: join(__dirname, '..', 'hello/hello.proto'),
        },
      },
    ]),
  ],
  controllers: [GrpcClientController],
})
export class GrpcClientModule {}
