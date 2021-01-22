# OgmaInterceptor Benchmarks

* Benchmarks were made by setting up identical NestJS applications and attaching either the OgmaModule or [morgan](https://npmjs.org/morgan) via `app.use()`. 
* These benchmarks were only ran for an Express server, as morgan is only configured to work for Express servers.
* Each request was made 10 time, and the time shown is the average response time for each request type. 

## Results

| Request Logger | GET | POST | PUT | PATCH | DELETE |
| - | - | - | - | - | - |
| ogma | 7.6 ms | 6.4 ms | 5.3 ms | 5.9 ms | 5 ms |
| morganDev | 6.8 ms | 6.1 ms | 5.6 ms | 6.1 ms | 5.2 ms |
| morganCombined | 7 ms | 5.9 ms | 5.5 ms | 6.4 ms | 4.8 ms |
| none | 7.3 ms | 6 ms | 5.5 ms | 6.2 ms | 5.1 ms |


## Information

Benchmarks generated on Darwin/darwin x64 19.6.0 ~Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz (cores/threads): 12
