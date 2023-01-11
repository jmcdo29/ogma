# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger    | Simple  | Long     | JSON    | Deep     |
| --------- | ------- | -------- | ------- | -------- |
| Bunyan    | 377.3ms | 4520.2ms | 407.0ms | 2200.3ms |
| Ogma      | 152.7ms | 1637.7ms | 267.8ms | 436.9ms  |
| OgmaMasks | 144.4ms | 1724.1ms | 281.8ms | 878.9ms  |
| Pino      | 112.3ms | 3957.8ms | 225.9ms | 1542.8ms |
| Winston   | 293.0ms | 6680.3ms | 268.4ms | 397.3ms  |

## Information

Benchmarks generated on Linux/linux x64 5.15.86 ~Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (cores/threads): 12
