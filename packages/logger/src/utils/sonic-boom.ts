import { OgmaStream } from '@ogma/common';
import SonicBoom from 'sonic-boom';

const noop = (_args?: any) => true; // eslint-disable-line @typescript-eslint/no-empty-function

/**
 * thanks pinojs
 * ref: https://github.com/pinojs/pino/blob/27d2ab8b58e64547fd24864c2f21ac898f4752c4/lib/tools.js#L219
 */
function buildSafeSonicBoom(opts: { fd: typeof process['stdout']['fd'] }) {
  // the ?? 1 is here to handle worker threads like using vitest
  const stream = new SonicBoom({ fd: opts.fd ?? 1 });

  stream.on('error', filterBrokenPipe);
  return stream;

  function filterBrokenPipe(err) {
    // Impossible to replicate across all operating systems
    /* istanbul ignore next */
    if (err.code === 'EPIPE') {
      // If we get EPIPE, we should stop logging here
      // however we have no control to the consumer of
      // SonicBoom, so we just overwrite the write method
      stream.write = noop;
      stream.end = noop;
      stream.flushSync = noop;
      stream.destroy = noop;
      return;
    }
    stream.removeListener('error', filterBrokenPipe);
    stream.emit('error', err);
  }
}

export function initializeStreamOnNodeJs(): OgmaStream {
  const sonicBoom = buildSafeSonicBoom({ fd: process.stdout.fd });

  return { write: sonicBoom.write.bind(sonicBoom) };
}
