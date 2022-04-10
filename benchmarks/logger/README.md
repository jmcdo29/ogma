# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger    | Simple  | Long     | JSON    | Deep     |
| --------- | ------- | -------- | ------- | -------- |
| Bunyan    | 179.3ms | 2549.0ms | 192.3ms | 1026.2ms |
| Ogma      | 153.4ms | 1153.0ms | 221.4ms | 317.9ms  |
| OgmaMasks | 138.5ms | 1102.3ms | 223.5ms | 574.2ms  |
| Pino      | 61.9ms  | 2426.7ms | 74.3ms  | 681.1ms  |
| Winston   | 176.2ms | 3767.3ms | 381.2ms | 261.0ms  |

## Information

Benchmarks generated on Darwin/darwin arm64 21.4.0 ~Apple M1 Pro (cores/threads): 10
