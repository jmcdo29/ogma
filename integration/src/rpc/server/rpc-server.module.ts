import { Module } from '@nestjs/common';
import { RpcServerController } from './rpc-server.controller';
import { AppService } from '../../app.service';

@Module({
  controllers: [RpcServerController],
  providers: [AppService],
})
export class RpcServerModule {}
