import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common';
import { OgmaSkip } from '../dist/decorators/skip.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMessage(): object {
    return this.appService.getSimpleMessage();
  }

  @Get('status')
  @HttpCode(201)
  getStatus(): object {
    return this.appService.getSimpleMessage();
  }

  @Get('error')
  getError(): never {
    throw new BadRequestException('Bad');
  }

  @OgmaSkip()
  @Get('skip')
  skipMessage(): object {
    return this.appService.getSimpleMessage();
  }
}
