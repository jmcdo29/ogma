import { OgmaStream } from '@ogma/common';
import * as onExit from 'on-exit-leak-free';
import SonicBoom from 'sonic-boom';
import { isMainThread } from 'worker_threads';

const noop = (_args?: any) => true; // eslint-disable-line @typescript-eslint/no-empty-function

/**
 * thanks pinojs
 * ref: https://github.com/pinojs/pino/blob/27d2ab8b58e64547fd24864c2f21ac898f4752c4/lib/tools.js#L219
 */
function buildSafeSonicBoom(opts) {
  const stream = new SonicBoom(opts);
  stream.on('error', filterBrokenPipe);
  // if we are sync: false, we must flush on exit
  if (!opts.sync && isMainThread) {
    onExit.register(stream, autoEnd);

    stream.on('close', function () {
      onExit.unregister(stream);
    });
  }
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

function autoEnd(stream, eventName) {
  // This check is needed only on some platforms
  /* istanbul ignore next */
  if (stream.destroyed) {
    return;
  }

  if (eventName === 'beforeExit') {
    // We still have an event loop, let's use it
    stream.flush();
    stream.on('drain', function () {
      stream.end();
    });
  } else {
    // For some reason istanbul is not detecting this, but it's there
    /* istanbul ignore next */
    // We do not have an event loop, so flush synchronously
    stream.flushSync();
  }
}

export function initializeStreamOnNodeJs(): OgmaStream {
  const sonicBoom = buildSafeSonicBoom({ fd: process.stdout.fd });

  return { write: sonicBoom.write.bind(sonicBoom) };
}
