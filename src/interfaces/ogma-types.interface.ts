import { ServerResponse } from 'http';
import { ExpressLikeRequest } from './express-like.interface';
import {
  FastifyLikeRequest,
  FastifyLikeResponse,
} from './fastify-like.interface';

export type OgmaRequest = FastifyLikeRequest | ExpressLikeRequest;
export type OgmaResponse = FastifyLikeResponse | ServerResponse;
