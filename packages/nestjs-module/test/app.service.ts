import { Injectable } from '@nestjs/common';

import { OgmaLogger, OgmaService } from '../src';

@Injectable()
export class AppService {
  constructor(@OgmaLogger('AppService') private readonly logger: OgmaService) {}

  getHello() {
    this.logger.log('Say Hello');
    return { hello: 'world' };
  }
}
