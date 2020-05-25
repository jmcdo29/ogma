import { Module } from '@nestjs/common';
import { AppService } from '../../app.service';
import { GrpcServerController } from './grpc-server.controller';

@Module({
  controllers: [GrpcServerController],
  providers: [AppService],
})
export class GrpcServerModule {}
