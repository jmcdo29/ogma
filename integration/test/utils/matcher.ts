/* eslint-disable no-redeclare */

import { color } from '@ogma/logger';
import { isIP } from 'net';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeALogObject(
        method: string,
        endpoint: string,
        protocol: string,
        status: string,
      ): R;
    }
  }
}

const expectMessage = (field: string, expected: string, actual: string) =>
  `Expected ${field} to be ${color.green(expected)} but got ${color.red(
    actual,
  )}.\n`;

expect.extend({
  toBeALogObject(
    received: string,
    method: string,
    endpoint: string,
    protocol: string,
    status: string,
  ) {
    let pass = true;
    let message = '';
    const [
      recIp,
      ,
      recMethod,
      recEndpoint,
      recProto,
      recStatus,
      recTime,
      ,
      recSize,
    ] = received.split(' ');
    if (!isIP(recIp)) {
      pass = false;
      message += expectMessage('Caller Ip', 'an IPv4 or IPv6', recIp);
    }
    if (recMethod !== method) {
      pass = false;
      message += expectMessage('method', method, recMethod);
    }
    if (recEndpoint !== endpoint) {
      pass = false;
      message += expectMessage('endpoint', endpoint, recEndpoint);
    }
    if (recProto !== protocol) {
      pass = false;
      message += expectMessage('protocol', protocol, recProto);
    }
    if (recStatus !== status) {
      pass = false;
      message += expectMessage('status', status, recStatus);
    }
    if (!/\d+ms/.test(recTime)) {
      pass = false;
      message += expectMessage('time', 'a time in milliseconds', recTime);
    }
    if (!/\d+/.test(recSize)) {
      pass = false;
      message += expectMessage('size', 'a content-size in bytes', recSize);
    }
    return {
      pass,
      message: () =>
        pass
          ? 'This matcher is not made to work with negation. Please do not use it'
          : message,
    };
  },
});

export {};
