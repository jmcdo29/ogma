import { ArgumentsHost, ContextType, Injectable } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

import { OgmaLogger } from '../../decorators';
import { OgmaInterceptorServiceOptions } from '../../interfaces';
import { OGMA_CONTEXT_PARSER } from '../../ogma.constants';
import { OgmaService } from '../../ogma.service';
import { DelegatorContextReturn, LogObject, MetaLogObject } from '../interfaces/log.interface';
import { AbstractInterceptorService } from './abstract-interceptor.service';

@Injectable()
export class DelegatorService {
  private readonly parserMap: Map<string, AbstractInterceptorService> = new Map();
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    @OgmaLogger(DelegatorService) private readonly logger: OgmaService,
  ) {}

  async onModuleInit() {
    const provders = this.discoveryService.getProviders();
    provders
      .filter(
        (provider) =>
          !provider.isNotMetatype && this.reflector.get(OGMA_CONTEXT_PARSER, provider.metatype),
      )
      .forEach((foundProvider) => {
        const contextType = this.reflector.get(OGMA_CONTEXT_PARSER, foundProvider.metatype);
        if (this.parserMap.has(contextType)) {
          this.logger.warn(
            `Already registered a parser for ${contextType}. New parser: ${foundProvider.name}`,
          );
        }
        this.parserMap.set(
          this.reflector.get(OGMA_CONTEXT_PARSER, foundProvider.metatype),
          foundProvider.instance,
        );
      });
  }

  setRequestId(context: ArgumentsHost, requestId: string): void {
    const parser = this.getParser(context.getType());
    parser.setRequestId(context, requestId);
  }

  getRequestId(context: ArgumentsHost): any {
    const parser = this.getParser(context.getType());
    return parser.getRequestId(context);
  }

  getContextSuccessString(
    data: any,
    context: ArgumentsHost,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): DelegatorContextReturn {
    const parser = this.getParser(context.getType());
    const { meta, ...logObject } = this.getContextString({
      method: 'getSuccessContext',
      data,
      context,
      startTime,
      options,
      parser,
    });
    return { meta, log: this.getStringOrObject(logObject, { json: options.json }) };
  }

  private getParser(type: ContextType | 'graphql'): AbstractInterceptorService {
    return this.parserMap.get(type);
  }

  getContextErrorString(
    error: any,
    context: ArgumentsHost,
    startTime: number,
    options: OgmaInterceptorServiceOptions,
  ): DelegatorContextReturn {
    const parser = this.getParser(context.getType());
    const { meta, ...logObject } = this.getContextString({
      method: 'getErrorContext',
      data: error,
      context,
      startTime,
      options,
      parser,
    });
    return { meta, log: this.getStringOrObject(logObject, { json: options.json }) };
  }

  private getContextString({
    method,
    data,
    context,
    startTime,
    options,
    parser,
  }: {
    method: 'getErrorContext' | 'getSuccessContext';
    data: any;
    context: ArgumentsHost;
    startTime: number;
    options: OgmaInterceptorServiceOptions;
    parser: AbstractInterceptorService;
  }): MetaLogObject {
    return parser[method](data, context, startTime, options);
  }

  private getStringOrObject(data: LogObject, options: { json: boolean }): string | LogObject {
    return options.json
      ? data
      : `${data.callerAddress} - ${data.method} ${data.callPoint} ${data.protocol} ${data.status} ${data.responseTime}ms - ${data.contentLength}`;
  }

  getStartTime(host: ArgumentsHost): number {
    const parser = this.getParser(host.getType());
    return parser.getStartTime(host);
  }
}
