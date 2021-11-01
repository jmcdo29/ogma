import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Readable } from 'stream';

@Injectable()
export class StreamService {
  readFromStream(stream: Readable): Subject<string> {
    const subject$ = new Subject<string>();
    let data = '';
    stream.on('readable', () => {
      let chunk;
      while (null !== (chunk = stream.read())) {
        data += chunk.toString();
      }
      subject$.next(data);
    });
    stream.on('end', () => {
      subject$.complete();
    });
    stream.on('error', (err) => {
      subject$.error(err);
    });
    return subject$;
  }
}
