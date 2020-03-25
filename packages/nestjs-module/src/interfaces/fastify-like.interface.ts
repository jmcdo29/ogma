import { IncomingMessage, ServerResponse } from 'http';

export interface FastifyLikeRequest {
  query: Record<string, any>;
  params: Record<string, any>;
  headers: Record<string, any>;
  body: any;
  req: IncomingMessage;
  id: any;
  ip: string;
  ips: string[];
  hostname: string;
  raw: IncomingMessage;
}

export interface FastifyLikeResponse {
  res: ServerResponse;
}
