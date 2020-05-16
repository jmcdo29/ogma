# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger | Simple | Long | JSON | Deep |
| --- | --- | --- | --- | --- |
| Bunyan | 375.159229ms | 4928.94154ms | 420.335668ms | 458.811827ms |
| Ogma | 229.933075ms | 2245.650824ms | 352.558238ms | 391.385758ms |
| Pino | 160.423314ms | 6529.866729ms | 163.253851ms | 443.295177ms |
| Winston | 470.131286ms | 5411.124633ms | 986.761038ms | 501.628974ms |

## Information

Benchmarks generated on Darwin/darwin x64 18.7.0 ~Intel(R) Core(TM) i7-7660U CPU @ 2.50GHz (cores/threads): 4
