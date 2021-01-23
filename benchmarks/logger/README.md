# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger | Simple | Long | JSON | Deep |
| --- | --- | --- | --- | --- |
| Bunyan | 417.473521ms | 6279.423785ms | 473.789475ms | 1074.793074ms |
| Ogma | 272.307529ms | 2546.839107ms | 622.572839ms | 498.17432ms |
| Pino | 211.314079ms | 5202.8843ms | 177.292055ms | 378.417611ms |
| Winston | 517.037943ms | 6608.191768ms | 477.775202ms | 534.562906ms |

## Information

Benchmarks generated on Linux/linux x64 5.4.0-64-generic ~Intel(R) Core(TM) i3-8130U CPU @ 2.20GHz (cores/threads): 4
