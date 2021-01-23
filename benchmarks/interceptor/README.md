# OgmaInterceptor Benchmarks

- Benchmarks were made by setting up identical NestJS applications and attaching either the OgmaModule or [morgan](https://npmjs.org/morgan) via `app.use()`.
- These benchmarks were only ran for an Express server, as morgan is only configured to work for Express servers.
- Each request was made 10 time, and the time shown is the average response time for each request type.

## Results

| Request Logger | GET    | POST    | PUT     | PATCH   | DELETE  |
| -------------- | ------ | ------- | ------- | ------- | ------- |
| ogma           | 9.2 ms | 10.8 ms | 10.6 ms | 12 ms   | 10.8 ms |
| morganDev      | 8.3 ms | 10.7 ms | 10.2 ms | 10.9 ms | 11.6 ms |
| morganCombined | 8.3 ms | 10.7 ms | 10.2 ms | 11 ms   | 11.7 ms |
| none           | 9 ms   | 10.5 ms | 10.3 ms | 12.1 ms | 10.9 ms |

## Information

Benchmarks generated on Linux/linux x64 5.4.0-64-generic ~Intel(R) Core(TM) i3-8130U CPU @ 2.20GHz (cores/threads): 4
