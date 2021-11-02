import { Injectable } from '@nestjs/common';
import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Readable } from 'stream';

@Injectable()
export class StreamService {
  readFromStream(stream: Readable): { log: Observable<string>; done: Observable<any> } {
    return {
      log: fromEvent(stream, 'data').pipe(
        filter((val) => Buffer.isBuffer(val)),
        map((val: Buffer) => val.toString('utf-8')),
      ),
      done: fromEvent(stream, 'end').pipe(map(() => true)),
    };
  }
}
