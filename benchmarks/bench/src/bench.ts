// to run this file, install: npm i --save benchmark pino @ogma/logger @nestjs/common
// and then just run with: npx ts-node benchmark.ts

import { Logger } from '@nestjs/common';
import { Ogma } from '@ogma/logger';
import Benchmark from 'benchmark';
import * as fs from 'fs';
import pino from 'pino';

const suite = new Benchmark.Suite();

const nestjsLogger = new Logger();
const ogmaLogger = new Ogma();
const ogmaJsonLogger = new Ogma({ json: true });
const pinoLogger = pino();

const file = process.cwd() + '/benchmarks/bench/README.md';

fs.writeFileSync(file, '');

suite.add('NestJS Logger', function () {
  nestjsLogger.log('Hello World!');
});

suite.add('Ogma', function () {
  ogmaLogger.info('Hello World!');
});

suite.add('OgmaJson', function () {
  ogmaJsonLogger.info('Hello World');
});

suite.add('Pino', function () {
  pinoLogger.info('Hello World!');
});

suite.add('console.log', function () {
  console.log('Hello World!');
});

suite.add('process.stdout', function () {
  process.stdout.write('Hello World!\n');
});

const results = [];

suite
  // add listeners
  .on('cycle', function (event) {
    results.push(String(event.target));
  })
  .on('complete', function () {
    results.forEach((result) => fs.appendFileSync(file, result + '<br>\n'));

    fs.appendFileSync(file, '<br>Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({
    async: true,
  });
