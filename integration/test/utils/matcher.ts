/* eslint-disable no-redeclare */

import { color } from '@ogma/logger';
import { isIP } from 'net';
import { LogObject } from '@ogma/nestjs-module/lib/interceptor/interfaces/log.interface';

const timeRegex = /\d+ms/;
const sizeRegex = /\d+/;

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
declare global {
  namespace jest {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    interface Matchers<R> {
      toBeALogObject(method: string, endpoint: string, protocol: string, status: string): R;
    }
  }
}

const expectMessage = (field: string, expected: string, actual: string) =>
  `Expected ${field} to be ${color.green(expected)} but got ${color.red(actual)}.\n`;

const returnMessage = (pass: boolean, message: string) => ({
  pass,
  message: () =>
    pass ? 'This matcher is not made to work with negation. Please do not use it' : message,
});

const doTest = (
  recIp: string,
  method: string,
  recMethod: string,
  endpoint: string,
  recEndpoint: string,
  protocol: string,
  recProto: string,
  status: string,
  recStatus: string,
  recTime: string,
  recSize: string,
): { pass: boolean; message: () => string } => {
  let pass = true;
  let message = '';
  if (!isIP(recIp) && !isIP(recIp.split(':')[0])) {
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
  if (!timeRegex.test(recTime)) {
    pass = false;
    message += expectMessage('time', 'a time in milliseconds', recTime);
  }
  if (!sizeRegex.test(recSize)) {
    pass = false;
    message += expectMessage('size', 'a content-size in bytes', recSize);
  }
  return returnMessage(pass, message);
};

expect.extend({
  toBeALogObject(
    received: string | LogObject,
    method: string,
    endpoint: string,
    protocol: string,
    status: string,
  ) {
    let recIp: string,
      recMethod: string,
      recEndpoint: string,
      recProto: string,
      recStatus: string,
      recTime: string,
      recSize: string;
    if (typeof received === 'string') {
      [recIp, , recMethod, recEndpoint, recProto, recStatus, recTime, , recSize] = received.split(
        ' ',
      );
    } else {
      ({
        callerAddress: recIp as any,
        protocol: recProto,
        callPoint: recEndpoint,
        responseTime: recTime as any,
        status: recStatus,
        method: recMethod,
        contentLength: recSize as any,
      } = received);
      recTime = `${recTime.toString()}ms`;
      recSize = recSize.toString();
    }
    return doTest(
      recIp,
      method,
      recMethod,
      endpoint,
      recEndpoint,
      protocol,
      recProto,
      status,
      recStatus,
      recTime,
      recSize,
    );
  },
});

export {};
