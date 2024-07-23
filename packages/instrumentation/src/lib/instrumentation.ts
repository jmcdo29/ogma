/* eslint-disable @typescript-eslint/no-this-alias */
import { context, diag, isSpanContextValid, Span, trace } from '@opentelemetry/api';
import {
  InstrumentationBase,
  InstrumentationNodeModuleDefinition,
  safeExecuteInTheMiddle,
} from '@opentelemetry/instrumentation';

import { OgmaInstrumentationConfig } from './types';

const ogmaVersions = ['>=3.2.0'];

export class OgmaInstrumentation extends InstrumentationBase {
  constructor(config: OgmaInstrumentationConfig = {}) {
    super('@opentelemetry/instrumentation-ogma', '0.0.1', config);
  }

  protected init() {
    return [
      new InstrumentationNodeModuleDefinition<any>(
        '@ogma/logger',
        ogmaVersions,
        (ogmaModule, moduleVersion) => {
          diag.debug(`Applying patch for @ogma/logger@${moduleVersion}`);
          const instrumentation = this;
          Object.assign(ogmaModule.OgmaDefaults, {
            ...ogmaModule.OgmaDefaults,
            mixin: instrumentation._getMixinFunction(),
          });

          return ogmaModule;
        },
      ),
    ];
  }

  override getConfig(): OgmaInstrumentationConfig {
    return this._config;
  }

  override setConfig(config: OgmaInstrumentationConfig) {
    this._config = config;
  }

  private _callHook(span: Span, record: Record<string, string>, level: string) {
    const hook = this.getConfig().logHook;

    if (!hook) {
      return;
    }

    safeExecuteInTheMiddle(
      () => hook(span, record, level),
      (err) => {
        if (err) {
          diag.error('@ogma/logger instrumentation: error calling logHook', err);
        }
      },
      true,
    );
  }

  private _getMixinFunction() {
    const instrumentation = this;
    return function otelMixin(level: string) {
      if (!instrumentation.isEnabled()) {
        return {};
      }

      const span = trace.getSpan(context.active());

      if (!span) {
        return {};
      }

      const spanContext = span.spanContext();

      if (!isSpanContextValid(spanContext)) {
        return {};
      }

      const record = {
        trace_id: spanContext.traceId,
        span_id: spanContext.spanId,
        trace_flags: `0${spanContext.traceFlags.toString(16)}`,
      };

      instrumentation._callHook(span, record, level);

      return record;
    };
  }
}
