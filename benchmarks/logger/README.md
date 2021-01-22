# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger | Simple | Long | JSON | Deep |
| - | - | - | - | - |
| Bunyan | 365.639714ms | 3366.430737ms | 402.997234ms | 872.559683ms |
| Ogma | 197.048245ms | 1707.446041ms | 624.110164ms | 444.304243ms |
| Pino | 158.316033ms | 4742.960689ms | 207.18999ms | 241.351321ms |
| Winston | 372.207588ms | 4704.382725ms | 482.269369ms | 517.493435ms |


## Information

Benchmarks generated on Darwin/darwin x64 19.6.0 ~Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz (cores/threads): 12
