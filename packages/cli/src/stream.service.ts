import { Injectable } from '@nestjs/common';
import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Readable } from 'stream';

@Injectable()
export class StreamService {
  readFromStream(stream: Readable): Observable<string> {
    stream.on('readable', () => {
      while (null !== stream.read()) {
        /* no op for data event */
      }
    });
    return fromEvent(stream, 'data').pipe(
      filter((val) => Buffer.isBuffer(val)),
      map((val: Buffer) => val.toString('utf-8')),
    );
  }
}
