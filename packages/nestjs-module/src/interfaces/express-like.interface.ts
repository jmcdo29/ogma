import { IncomingMessage } from 'http';

export interface ExpressLikeRequest extends IncomingMessage {
  ips: string[];
  ip: string;
}
