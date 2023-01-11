# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger    | Simple  | Long     | JSON    | Deep     |
| --------- | ------- | -------- | ------- | -------- |
| Bunyan    | 356.4ms | 4508.5ms | 388.1ms | 2245.3ms |
| Ogma      | 150.2ms | 1610.1ms | 249.9ms | 423.2ms  |
| OgmaMasks | 134.0ms | 1755.2ms | 258.9ms | 631.1ms  |
| OgmaJSON  | 360.1ms | 4512.1ms | 565.4ms | 754.4ms  |
| Pino      | 104.1ms | 3929.2ms | 109.9ms | 1773.0ms |
| Winston   | 316.9ms | 6494.4ms | 278.8ms | 519.1ms  |

## Information

Benchmarks generated on Linux/linux x64 5.15.86 ~Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (cores/threads): 12
