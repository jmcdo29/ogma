import { NestFactory } from '@nestjs/core';
import { ExpressParser } from '@ogma/platform-express';
import { request } from 'http';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

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

Promise.all([
  bootstrapOgma(),
  bootstrapMorganDev('dev'),
  bootstrapMorganDev('combined'),
  bootstrap(),
]).then((result) => {
  const res = {
    ogma: result[0],
    morganDev: result[1],
    morganCombined: result[2],
    none: result[3],
  };
  console.log(res);
});
