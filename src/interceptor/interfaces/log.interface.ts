export interface LogObject {
  callerAddress: string[] | string;
  method: string;
  callPoint: string;
  protocol: string;
  status: string;
  responseTime: number;
  contentLength: number;
}
