# OgmaInterceptor Benchmarks

- Benchmarks were made by setting up identical NestJS applications and attaching either the OgmaModule or [morgan](https://npmjs.org/morgan) via `app.use()`.
- These benchmarks were only ran for an Express server, as morgan is only configured to work for Express servers.
- Each request was made 10 time, and the time shown is the average response time for each request type.

## Results

| Request Logger | GET    | POST   | PUT    | PATCH  | DELETE |
| -------------- | ------ | ------ | ------ | ------ | ------ |
| ogma           | 3.5 ms | 3 ms   | 3.1 ms | 3.3 ms | 3.3 ms |
| morganDev      | 3.3 ms | 2.9 ms | 3.3 ms | 3.1 ms | 3.1 ms |
| morganCombined | 3.1 ms | 2.9 ms | 3.4 ms | 3 ms   | 3.2 ms |
| none           | 3.1 ms | 3.2 ms | 3.3 ms | 3.2 ms | 3.2 ms |

## Information

Benchmarks generated on Linux/linux x64 5.11.0-7614-generic ~Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz (cores/threads): 12
