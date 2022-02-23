import { Module } from '@nestjs/common';

import { AppService } from '../../app.service';
import { RpcServerController } from './rpc-server.controller';

@Module({
  controllers: [RpcServerController],
  providers: [AppService],
})
export class RpcServerModule {}
