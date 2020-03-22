import { ServerResponse } from 'http';
import { ExpressLikeRequest } from './express-like.interface';
import {
  FastifyLikeRequest,
  FastifyLikeResponse,
} from './fastify-like.interface';
import { SocketIoLike } from './socket-io-like.interface';
import { WsLike } from './ws-like.interface';

export type OgmaRequest = FastifyLikeRequest | ExpressLikeRequest;
export type OgmaResponse = FastifyLikeResponse | ServerResponse;
export type OgmaClient = SocketIoLike | WsLike;
