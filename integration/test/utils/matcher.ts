import { style } from '@ogma/styler';
import { isIP } from 'net';
import { ok } from 'uvu/assert';

interface LogObject {
  /**
   * The IP or IP addresses of the machine making a call to the server
   */
  callerAddress: string[] | string;
  /**
   * REST: an HTTP Verb (GET, POST, PATCH, etc)
   *
   * GraphQL: Query, Mutation, or Subscription
   *
   * Microservice: Request or Reply
   *
   * Websockets: unknown at moment
   */
  method: string;
  /**
   * REST: endpoint
   *
   * GraphQL: Query or Mutation name
   *
   * Microservice: Message Topic
   *
   * WebSockets: Subscription Event name
   */
  callPoint: string;
  /**
   * REST: HTTP/majorVersion.minorVersion e.g. `HTTP/1.1`
   *
   * GraphQL: HTTP/majorVersion.minorVersion e.g. `HTTP/1.1`
   *
   * Microservice: microservice type e.g. amqp
   *
   * WebSockets: ws
   */
  protocol: string;
  /**
   * REST: HTTP Status code, will extract from Nest Exception if possible
   *
   * GraphQL: HTTP Status code, will extract from Nest Exception if possible
   *
   * Microservice: 200 for success, 500 for error
   *
   * Websockets: 200 for success, 500 for error
   */
  status: string;
  /**
   * The time it took the request, in milliseconds, from entering the interceptor to leaving the interceptor
   */
  responseTime: number;
  /**
   * Number of bytes in the response data, determined by Buffer encoding the response body
   */
  contentLength: number;
}

const timeRegex = /\d+ms/;
const sizeRegex = /\d+/;

const expectMessage = (field: string, expected: string, actual: string) =>
  `Expected ${field} to be ${style.green.apply(expected)} but got ${style.red.apply(actual)}.\n`;

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
): { pass: boolean; message: string } => {
  let pass = true;
  let message = '';
  if (!isIP(recIp) && !isIP(recIp.split(/:\d{2,}/)[0])) {
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
  if (!recProto.match(protocol)) {
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
  return { pass, message };
};
export const toBeALogObject = (
  received: string | LogObject | unknown,
  method: string,
  endpoint: string,
  protocol: string,
  status: string,
) => {
  let recIp: string,
    recMethod: string,
    recEndpoint: string,
    recProto: string,
    recStatus: string,
    recTime: string,
    recSize: string;
  if (typeof received === 'string') {
    [recIp, , recMethod, recEndpoint, recProto, recStatus, recTime, , recSize] =
      received.split(' ');
  } else if (isLogObject(received)) {
    let callerAddress: string | string[], responseTime: number, contentLength: number;
    ({
      callerAddress,
      protocol: recProto,
      callPoint: recEndpoint,
      responseTime,
      status: recStatus,
      method: recMethod,
      contentLength,
    } = received);
    recIp = Array.isArray(callerAddress) ? callerAddress.join(' ') : callerAddress;
    recTime = responseTime.toString();
    recSize = contentLength.toString();
    recTime = `${recTime.toString()}ms`;
    recSize = recSize.toString();
  }
  const result = doTest(
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
  ok(result.pass, result.message);
};

const isLogObject = (received: unknown): received is LogObject => {
  return typeof received === 'object' && 'callerAddress' in received;
};
