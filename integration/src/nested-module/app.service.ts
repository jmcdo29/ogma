import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class AppService {
  constructor(@OgmaLogger(AppService) private readonly logger: OgmaService) {}

  getHello() {
    this.logger.log('Hello NestedModule');
    return { hello: 'World' };
  }
}
