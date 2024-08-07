---
id: instrumentation
title: Instrumentation
layout: ../../layouts/MainLayout.astro
---

This module provides automatic instrumentation for injection of trace context for the [`ogma`](https://www.npmjs.com/package/@ogma/logger) module, which may be loaded using the [`@opentelemetry/sdk-trace-node`](https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-sdk-trace-node) package and is included in the [`@opentelemetry/auto-instrumentations-node`](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node) bundle.

If total installation size is not constrained, it is recommended to use the [`@opentelemetry/auto-instrumentations-node`](https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node) bundle with [@opentelemetry/sdk-node](`https://www.npmjs.com/package/@opentelemetry/sdk-node`) for the most seamless instrumentation experience.

Compatible with OpenTelemetry JS API and SDK `1.0+`.

## Installation

```bash
npm install --save @ogma/instrumentation
```

## Usage

```js
const {
  NodeTracerProvider
} = require('@opentelemetry/sdk-trace-node');
const {
  registerInstrumentations
} = require('@opentelemetry/instrumentation');
const { OgmaInstrumentation } = require('@ogma/instrumentation');

const provider = new NodeTracerProvider();
provider.register();

registerInstrumentations({
  instrumentations: [
    new OgmaInstrumentation({
      // Optional hook to insert additional context to log object.
      logHook: (span, record, level) => {
        record['resource.service.name'] =
          provider.resource.attributes['service.name'];
      }
    })
    // other instrumentations
  ]
});

const { Ogma } = require('@ogma/logger');
const logger = new Ogma();
logger.info('foobar');
// {"level":"INFO","meta":{"trace_id":"80d20824ae2f4a039c9ddd6463ecf2a2","span_id":"bdf2a9482f641cb9","trace_flags":"01"},"message":"foobar"...}
```

### Fields added to ogma log objects

For the current active span, the following fields are injected:

- `trace_id`
- `span_id`
- `trace_flags`

When no span context is active or the span context is invalid, injection is skipped.

### Supported versions

`>=3.2.0`

## Useful links

- For more information on OpenTelemetry, visit: <https://opentelemetry.io/>
- For more about OpenTelemetry JavaScript: <https://github.com/open-telemetry/opentelemetry-js>
- For help or feedback on this project, join us in [GitHub Discussions][discussions-url]
