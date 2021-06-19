# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger | Simple | Long | JSON | Deep |
| --- | --- | --- | --- | --- |
| Bunyan | 391.029385ms | 4345.959124ms | 404.239484ms | 2222.148842ms |
| Ogma | 293.672919ms | 2040.589322ms | 425.247107ms | 587.8698ms |
| Pino | 117.382004ms | 4173.841575ms | 134.693063ms | 1436.681928ms |
| Winston | 389.26811ms | 4871.28181ms | 342.846514ms | 684.94502ms |

## Information

Benchmarks generated on Linux/linux x64 5.11.0-7614-generic ~Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (cores/threads): 12
