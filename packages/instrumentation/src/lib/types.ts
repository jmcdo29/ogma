import { Span } from '@opentelemetry/api';
import { InstrumentationConfig } from '@opentelemetry/instrumentation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LogHookFunction = (span: Span, record: Record<string, any>, level?: string) => void;

export interface OgmaInstrumentationConfig extends InstrumentationConfig {
  logHook?: LogHookFunction;
}
