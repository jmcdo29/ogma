# OgmaInterceptor Benchmarks

- Benchmarks were made by setting up identical NestJS applications and attaching either the OgmaModule or [morgan](https://npmjs.org/morgan) via `app.use()`.
- These benchmarks were only ran for an Express server, as morgan is only configured to work for Express servers.
- Each request was made 10 time, and the time shown is the average response time for each request type.

## Results

| Request Logger | GET     | POST    | PUT     | PATCH   | DELETE  |
| -------------- | ------- | ------- | ------- | ------- | ------- |
| ogma           | 14.1 ms | 10.7 ms | 13 ms   | 10.1 ms | 17.3 ms |
| morganDev      | 13.2 ms | 11.3 ms | 13 ms   | 9.6 ms  | 12.9 ms |
| morganCombined | 13.4 ms | 11.2 ms | 12.9 ms | 9.8 ms  | 13.9 ms |
| none           | 13.5 ms | 10.9 ms | 12.7 ms | 9.9 ms  | 15.8 ms |

## Information

Benchmarks generated on Linux/linux x64 5.0.0-32-generic ~Intel(R) Core(TM) i3-8130U CPU @ 2.20GHz (cores/threads): 4
