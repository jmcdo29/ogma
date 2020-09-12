# OgmaInterceptor Benchmarks

- Benchmarks were made by setting up identical NestJS applications and attaching either the OgmaModule or [morgan](https://npmjs.org/morgan) via `app.use()`.
- These benchmarks were only ran for an Express server, as morgan is only configured to work for Express servers.
- Each request was made 10 time, and the time shown is the average response time for each request type.

## Results

| Request Logger | GET    | POST   | PUT    | PATCH  | DELETE |
| -------------- | ------ | ------ | ------ | ------ | ------ |
| ogma           | 6 ms   | 5.3 ms | 6.1 ms | 5.3 ms | 5.1 ms |
| morganDev      | 5.5 ms | 5.5 ms | 6.1 ms | 5.2 ms | 4.9 ms |
| morganCombined | 5.6 ms | 5.5 ms | 6 ms   | 5.3 ms | 5 ms   |
| none           | 5.7 ms | 5.4 ms | 6.2 ms | 5.2 ms | 5.1 ms |

## Information

Benchmarks generated on Linux/linux x64 5.4.0-47-generic ~Intel(R) Core(TM) i3-8130U CPU @ 2.20GHz (cores/threads): 4
