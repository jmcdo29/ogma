import { Module } from '@nestjs/common';

import { AppService } from '../app.service';
import { HttpController } from './http.controller';

@Module({
  controllers: [HttpController],
  providers: [AppService],
})
export class HttpServerModule {}
