import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { OgmaFilterLogger } from '@ogma/nestjs-module';

@Catch()
export class ErrorLoggingFilter extends BaseExceptionFilter {
  constructor(private readonly logger: OgmaFilterLogger) {
    super();
  }

  catch(exception: Error, host: ArgumentsHost) {
    this.logger.log(exception, host);
    return super.catch(exception, host);
  }
}
