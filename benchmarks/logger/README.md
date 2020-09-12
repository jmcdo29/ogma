# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger | Simple | Long | JSON | Deep |
| --- | --- | --- | --- | --- |
| Bunyan | 354.955363ms | 4067.132908ms | 804.267905ms | 1287.702897ms |
| Ogma | 260.002731ms | 1938.668793ms | 289.710806ms | 398.153038ms |
| Pino | 139.931047ms | 5255.606637ms | 406.781887ms | 2781.67296ms |
| Winston | 462.864598ms | 5052.486821ms | 3371.397049ms | 1742.606749ms |

## Information

Benchmarks generated on Linux/linux x64 5.4.0-47-generic ~Intel(R) Core(TM) i3-8130U CPU @ 2.20GHz (cores/threads): 4
