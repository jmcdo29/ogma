import { createWriteStream } from 'fs';
import * as os from 'os';
import { join } from 'path';

interface HttpMethods {
  GET: number;
  POST: number;
  PATCH: number;
  PUT: number;
  DELETE: number;
}

interface OgmaInterceptorBenchmarkResult {
  ogma: HttpMethods;
  morganDev: HttpMethods;
  morganCombined: HttpMethods;
  none: HttpMethods;
}

function makeRow(name: string, method: HttpMethods): string {
  return `| ${name} | ${method.GET} ms | ${method.POST} ms | ${method.PUT} ms | ${method.PATCH} ms | ${method.DELETE} ms |\n`;
}

function makeTable(methodResults: OgmaInterceptorBenchmarkResult): string {
  let table = `| Request Logger | GET | POST | PUT | PATCH | DELETE |
| - | - | - | - | - | - |\n`;
  for (const name of Object.keys(methodResults)) {
    table += makeRow(name, methodResults[name]);
  }
  return table;
}

export function writeBenchmarks(result: OgmaInterceptorBenchmarkResult) {
  const benchmarks = `# OgmaInterceptor Benchmarks

* Benchmarks were made by setting up identical NestJS applications and attaching either the OgmaModule or [morgan](https://npmjs.org/morgan) via \`app.use()\`. 
* These benchmarks were only ran for an Express server, as morgan is only configured to work for Express servers.
* Each request was made 10 time, and the time shown is the average response time for each request type. 

## Results

${makeTable(result)}

## Information

Benchmarks generated on ${os.type()}/${os.platform()} ${os.arch()} ${os.release()} ~${
    os.cpus()[0].model
  } (cores/threads): ${os.cpus().length}
`;
  const ws = createWriteStream(join(__dirname, '..', 'README.md'));
  ws.write(Buffer.from(benchmarks));
  ws.close();
}
