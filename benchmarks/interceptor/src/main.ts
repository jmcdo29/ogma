import { NestFactory } from '@nestjs/core';
import { ExpressParser } from '@ogma/platform-express';
import { request } from 'http';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { writeBenchmarks } from './benchmark-writer';

type httpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

async function httpPromise(url: string, method: httpMethod) {
  return new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: method.toLowerCase(),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
        res.on('error', (err) => reject(err));
      },
    );
    if (method === 'PATCH' || method === 'POST' || method === 'PUT') {
      req.write('');
    }
    req.end();
  });
}

async function timeHttp(url: string, method: httpMethod) {
  const start = Date.now();
  await httpPromise(url, method);
  return Date.now() - start;
}

async function getTimes(url: string) {
  const times = {};
  for (const method of ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']) {
    times[method] = await timeHttp(url, method as httpMethod);
  }
  return times;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(0);
  const baseUrl = await app.getUrl();
  const times = await getTimes(baseUrl);
  await app.close();
  return times;
}

async function bootstrapOgma() {
  const app = await NestFactory.create(
    AppModule.forRoot({
      service: {
        application: 'Benchmark',
      },
      interceptor: {
        http: ExpressParser,
      },
    }),
  );
  await app.listen(0);
  const baseUrl = await app.getUrl();
  const times = await getTimes(baseUrl);
  await app.close();
  return times;
}

async function bootstrapMorganDev(format: 'dev' | 'combined') {
  const app = await NestFactory.create(AppModule);
  app.use(morgan(format));
  await app.listen(0);
  const baseUrl = await app.getUrl();
  const times = await getTimes(baseUrl);
  await app.close();
  return times;
}

async function timePerformance() {
  const result = await Promise.all([
    bootstrapOgma(),
    bootstrapMorganDev('dev'),
    bootstrapMorganDev('combined'),
    bootstrap(),
  ]);
  return {
    ogma: result[0],
    morganDev: result[1],
    morganCombined: result[2],
    none: result[3],
  };
}

async function multipleRuns() {
  const times = [];
  for (let i = 0; i < 10; i++) {
    times.push(await timePerformance());
  }
  const result = {
    ogma: {},
    morganDev: {},
    morganCombined: {},
    none: {},
  };
  times.reduce((prev, curr) => {
    for (const runType of Object.keys(curr)) {
      for (const key of Object.keys(curr[runType])) {
        if (!result[runType][key]) {
          result[runType][key] = curr[runType][key];
        } else {
          result[runType][key] += curr[runType][key];
        }
      }
    }
  });
  Object.keys(result).forEach((runType) => {
    Object.keys(result[runType]).forEach((key) => {
      result[runType][key] = result[runType][key] / times.length;
    });
  });
  return result;
}

multipleRuns().then((result) => writeBenchmarks(result as any));
