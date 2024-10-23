import { Ogma as OgmaClass } from '@ogma/logger';
import { context, INVALID_SPAN_CONTEXT, Span, trace } from '@opentelemetry/api';
import { AsyncHooksContextManager } from '@opentelemetry/context-async-hooks';
import { InMemorySpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { readFileSync } from 'fs';
import * as hanbi from 'hanbi';
import { resolve } from 'path';
import * as semver from 'semver';
import { Writable } from 'stream';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { OgmaInstrumentation } from '../src';

const memoryExporter = new InMemorySpanExporter();
const provider = new NodeTracerProvider();
const tracer = provider.getTracer('default');
provider.addSpanProcessor(new SimpleSpanProcessor(memoryExporter));
context.setGlobalContextManager(new AsyncHooksContextManager());

const kMessage = 'log-message';

type OgmaInstrumentationSuiteContext = {
  testInjection: (logger: OgmaClass, writeSpy: hanbi.Stub<Writable['write']>, span: Span) => any;
  testNoInjection: (logger: OgmaClass, writeSpy: hanbi.Stub<Writable['write']>) => any;
  instrumentation: OgmaInstrumentation;
  stream: Writable;
  Ogma: new (...args: ConstructorParameters<typeof OgmaClass>) => OgmaClass;
  writeSpy: hanbi.Stub<Writable['write']>;
  logger: OgmaClass;
};

const EnabledInstrumentationSuite = suite<OgmaInstrumentationSuiteContext>(
  '@ogma/instrumentation - Enabled Instrumentation',
  {
    testInjection: (logger: OgmaClass, writeSpy: hanbi.Stub<Writable['write']>, span: Span) => {
      logger.info(kMessage);
      is(writeSpy.calls.size, 1);
      const record = JSON.parse(writeSpy.firstCall.args[0].toString());
      const { traceId, spanId, traceFlags } = span.spanContext();
      equal(record.meta['trace_id'], traceId);
      equal(record.meta['span_id'], spanId);
      equal(record.meta['trace_flags'], `0${traceFlags.toString(16)}`);
      equal(kMessage, record['message']);
      return record;
    },
    testNoInjection: (logger: OgmaClass, writeSpy: hanbi.Stub<Writable['write']>) => {
      logger.info(kMessage);
      is(writeSpy.calls.size, 1);
      const record = JSON.parse(writeSpy.firstCall.args[0].toString());
      equal(record.meta?.['trace_id'], undefined);
      equal(record.meta?.['span_id'], undefined);
      equal(record.meta?.['trace_flags'], undefined);
      equal(kMessage, record['message']);
      return record;
    },
    instrumentation: new OgmaInstrumentation(),
    stream: new Writable(),
    Ogma: {} as any,
    writeSpy: hanbi.stub(() => {
      return true;
    }),
    logger: new OgmaClass(),
  },
);
EnabledInstrumentationSuite.before((ctx) => {
  ctx.instrumentation = new OgmaInstrumentation();
  ctx.instrumentation.enable();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ctx.Ogma = require('@ogma/logger').Ogma;
});
EnabledInstrumentationSuite.before.each((ctx) => {
  ctx.stream = new Writable();
  ctx.stream._write = () => {};
  ctx.writeSpy = hanbi.stubMethod(ctx.stream, 'write');
  ctx.logger = new ctx.Ogma({ stream: ctx.stream, json: true });
});

EnabledInstrumentationSuite('injects span context to records', (ctx) => {
  const span = tracer.startSpan('abc');
  context.with(trace.setSpan(context.active(), span), () => {
    ctx.testInjection(ctx.logger, ctx.writeSpy, span);
  });
});

EnabledInstrumentationSuite('injects span context to records in named export', (ctx) => {
  const span = tracer.startSpan('abc');
  context.with(trace.setSpan(context.active(), span), () => {
    ctx.testInjection(ctx.logger, ctx.writeSpy, span);
  });
});

EnabledInstrumentationSuite('calls the users log hook', (ctx) => {
  const span = tracer.startSpan('abc');
  ctx.instrumentation.setConfig({
    enabled: true,
    logHook: (_span, record, level) => {
      record['resource.service.name'] = 'test-service';
      if (
        semver.satisfies(
          JSON.parse(readFileSync(resolve('@ogma/logger/package.json')).toString()),
          '>= 3.2.0',
        )
      ) {
        equal(level, 30);
      }
    },
  });
  context.with(trace.setSpan(context.active(), span), () => {
    const record = ctx.testInjection(ctx.logger, ctx.writeSpy, span);
    equal(record.meta['resource.service.name'], 'test-service');
  });
});

EnabledInstrumentationSuite('does not inject span context if no span is active', (ctx) => {
  equal(trace.getSpan(context.active()), undefined);
  ctx.testNoInjection(ctx.logger, ctx.writeSpy);
});

EnabledInstrumentationSuite('does not inject span context if span context is invalid', (ctx) => {
  const span = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);
  context.with(trace.setSpan(context.active(), span), () => {
    ctx.testNoInjection(ctx.logger, ctx.writeSpy);
  });
});

EnabledInstrumentationSuite('does not propagate exceptions from user hooks', (ctx) => {
  const span = tracer.startSpan('abc');
  ctx.instrumentation.setConfig({
    enabled: true,
    logHook: () => {
      throw new Error('Oops');
    },
  });
  context.with(trace.setSpan(context.active(), span), () => {
    ctx.testInjection(ctx.logger, ctx.writeSpy, span);
  });
});

EnabledInstrumentationSuite.run();

// describe('OgmaInstrumentation', () => {
//   let stream: Writable;
//   let writeSpy: hanbi.Stub<typeof stream.write>;
//   let Ogma: typeof OgmaClass;
//   let instrumentation: OgmaInstrumentation;
//   let logger: OgmaClass;

//   function init() {
//     stream = new Writable();
//     stream._write = () => {};
//     writeSpy = hanbi.stubMethod(stream, 'write');
//     logger = new Ogma({ stream, json: true });
//   }

//   before(() => {
//     instrumentation = new OgmaInstrumentation();
//     instrumentation.enable();
//     ({ Ogma } = require('@ogma/logger'));
//   });

//   describe('enabled instrumentation', () => {
//     beforeEach(() => {
//       init();
//     });

//     it('injects span context to records', () => {
//       const span = tracer.startSpan('abc');
//       context.with(trace.setSpan(context.active(), span), () => {
//         testInjection(span);
//       });
//     });

//     it('injects span context to records in named export', function () {
//       init();
//       const span = tracer.startSpan('abc');
//       context.with(trace.setSpan(context.active(), span), () => {
//         testInjection(span);
//       });
//     });

//     it('calls the users log hook', () => {
//       const span = tracer.startSpan('abc');
//       instrumentation.setConfig({
//         enabled: true,
//         logHook: (_span, record, level) => {
//           record['resource.service.name'] = 'test-service';
//           if (
//             semver.satisfies(
//               JSON.parse(readFileSync(resolve('@ogma/logger/package.json')).toString()),
//               '>= 3.2.0',
//             )
//           ) {
//             equal(level, 30);
//           }
//         },
//       });
//       context.with(trace.setSpan(context.active(), span), () => {
//         const record = testInjection(span);
//         equal(record.meta['resource.service.name'], 'test-service');
//       });
//     });

//     it('does not inject span context if no span is active', () => {
//       equal(trace.getSpan(context.active()), undefined);
//       testNoInjection();
//     });

//     it('does not inject span context if span context is invalid', () => {
//       const span = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);
//       context.with(trace.setSpan(context.active(), span), () => {
//         testNoInjection();
//       });
//     });

//     it('does not propagate exceptions from user hooks', () => {
//       const span = tracer.startSpan('abc');
//       instrumentation.setConfig({
//         enabled: true,
//         logHook: () => {
//           throw new Error('Oops');
//         },
//       });
//       context.with(trace.setSpan(context.active(), span), () => {
//         testInjection(span);
//       });
//     });
//   });

//   describe('logger construction', () => {
//     let stdoutSpy: hanbi.Stub<typeof process.stdout.write>;

//     beforeEach(() => {
//       stream = new Writable();
//       stream._write = () => {};
//       writeSpy = hanbi.stubMethod(stream, 'write');
//       stdoutSpy = hanbi.stubMethod(process.stdout, 'write');
//     });

//     afterEach(() => {
//       stdoutSpy.restore();
//     });

//     it('does not fail when constructing logger without arguments', () => {
//       logger = new Ogma({
//         json: true,
//         stream: {
//           write: (message: unknown) => process.stdout.write(message as string),
//         },
//       });
//       const span = tracer.startSpan('abc');
//       context.with(trace.setSpan(context.active(), span), () => {
//         logger.info(kMessage);
//       });
//       const record = JSON.parse(stdoutSpy.firstCall.args[0].toString());
//       assertRecord(record, span);
//     });

//     it('preserves user options and adds a mixin', () => {
//       logger = new Ogma({ application: 'LogLog', stream, json: true });

//       const span = tracer.startSpan('abc');
//       context.with(trace.setSpan(context.active(), span), () => {
//         const record = testInjection(span);
//         equal(record['application'], 'LogLog');
//       });
//     });

//     describe('binary arguments', () => {
//       it('is possible to construct logger with undefined options', () => {
//         logger = new Ogma({ stream, json: true });
//         const span = tracer.startSpan('abc');
//         context.with(trace.setSpan(context.active(), span), () => {
//           testInjection(span);
//         });
//       });

//       it('ensures user mixin values take precedence', () => {
//         logger = new Ogma({
//           mixin() {
//             return { trace_id: '123' };
//           },
//           stream,
//           json: true,
//         });

//         const span = tracer.startSpan('abc');
//         context.with(trace.setSpan(context.active(), span), () => {
//           logger.info(kMessage);
//         });

//         const record = JSON.parse(writeSpy.firstCall.args[0].toString());
//         equal(record.meta['trace_id'], '123');
//       });
//     });
//   });

//   describe('disabled instrumentation', () => {
//     before(() => {
//       instrumentation.disable();
//     });

//     after(() => {
//       instrumentation.enable();
//     });

//     beforeEach(() => init());

//     it('does not inject span context', () => {
//       const span = tracer.startSpan('abc');
//       context.with(trace.setSpan(context.active(), span), () => {
//         testNoInjection();
//       });
//     });

//     it('does not call log hook', () => {
//       const span = tracer.startSpan('abc');
//       instrumentation.setConfig({
//         enabled: false,
//         logHook: (_span, record) => {
//           record.meta['resource.service.name'] = 'test-service';
//         },
//       });
//       context.with(trace.setSpan(context.active(), span), () => {
//         const record = testNoInjection();
//         equal(record.meta?.['resource.service.name'], undefined);
//       });
//     });

//     it('injects span context once re-enabled', () => {
//       instrumentation.enable();
//       const span = tracer.startSpan('abc');
//       context.with(trace.setSpan(context.active(), span), () => {
//         testInjection(span);
//       });
//     });
//   });
// });
