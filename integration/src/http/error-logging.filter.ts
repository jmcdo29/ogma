import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { OgmaFilterService } from '@ogma/nestjs-module';

@Catch()
export class ErrorLoggingFilter extends BaseExceptionFilter {
  constructor(private readonly logger: OgmaFilterService) {
    super();
  }

  catch(exception: Error, host: ArgumentsHost) {
    this.logger.log(exception, host);
    return super.catch(exception, host);
  }
}
