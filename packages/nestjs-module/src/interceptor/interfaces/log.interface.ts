export interface LogObject {
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

export interface MetaLogObject extends LogObject {
  meta?: unknown;
}

export interface DelegatorContextReturn {
  meta?: unknown;
  log: LogObject | string;
}
