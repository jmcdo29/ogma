# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger | Simple | Long | JSON | Deep |
| --- | --- | --- | --- | --- |
| Bunyan | 358.503331ms | 5150.968539ms | 401.276122ms | 885.27512ms |
| Ogma | 249.590941ms | 1966.489754ms | 284.218876ms | 382.467005ms |
| Pino | 153.721066ms | 5568.779201ms | 172.492747ms | 245.40139ms |
| Winston | 468.264545ms | 5491.972299ms | 354.748487ms | 451.454986ms |

## Information

Benchmarks generated on Linux/linux x64 5.0.0-32-generic ~Intel(R) Core(TM) i3-8130U CPU @ 2.20GHz (cores/threads): 4
