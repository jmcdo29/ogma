# Ogma Logger Benchmarks

Benchmarks were made by testing the logging capabilities of several loggers against each other. All loggers are writing to a writeStream of `/dev/null`. Each logger writes 100000 logs of each log type. Simple is a small string. JSON is a simple json, one key one value. Long is a 2000 random byte string. Deep is a deep JSON, including using the `globalThis`. All timings were made by using the `perf_hooks` module.

## Results

| Logger | Simple | Long | JSON | Deep |
| --- | --- | --- | --- | --- |
| Bunyan | 355.005893ms | 4099.797733ms | 410.885866ms | 2266.010139ms |
| Ogma | 172.904867ms | 1847.369098ms | 310.955876ms | 445.961304ms |
| Pino | 116.647594ms | 4287.163808ms | 141.358471ms | 1355.486535ms |
| Winston | 380.9764ms | 5127.20654ms | 353.4015ms | 457.380278ms |

## Information

Benchmarks generated on Linux/linux x64 5.11.0-7614-generic ~Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (cores/threads): 12
