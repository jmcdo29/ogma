import { Injectable } from '@nestjs/common';
import { SimpleObject } from './models';

@Injectable()
export class AppService {
  getHello(): SimpleObject {
    return { key: 'value' };
  }
}
