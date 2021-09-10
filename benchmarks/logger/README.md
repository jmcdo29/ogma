# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger    | Simple  | Long     | JSON    | Deep     |
| --------- | ------- | -------- | ------- | -------- |
| Bunyan    | 383.3ms | 4037.3ms | 411.5ms | 2000.3ms |
| Ogma      | 177.0ms | 1790.2ms | 338.0ms | 467.4ms  |
| OgmaMasks | 171.2ms | 1846.6ms | 315.1ms | 695.4ms  |
| Pino      | 126.6ms | 4056.8ms | 470.4ms | 1385.1ms |
| Winston   | 398.4ms | 4724.1ms | 337.3ms | 462.8ms  |

## Information

Benchmarks generated on Linux/linux x64 5.11.0-7620-generic ~Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (cores/threads): 12
