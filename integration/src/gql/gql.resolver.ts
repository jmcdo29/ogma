import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { OgmaSkip } from '@ogma/nestjs-module';

import { AppService } from '../app.service';
import { FailGuard } from '../shared/fail.guard';
import { ExceptionFilter } from './exception.filter';
import { SimpleObject } from './simple-object.model';

@Resolver(() => SimpleObject)
@UseFilters(ExceptionFilter)
export class GqlResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => SimpleObject)
  getQuery(): SimpleObject {
    return this.appService.getHello();
  }

  @Mutation(() => SimpleObject)
  getMutation(): SimpleObject {
    return this.appService.getHello();
  }

  @Query(() => SimpleObject)
  getError(): never {
    throw new BadRequestException('Borked');
  }

  @OgmaSkip()
  @Query(() => SimpleObject)
  getSkip(): SimpleObject {
    return this.appService.getHello();
  }

  @Query(() => SimpleObject)
  @UseGuards(FailGuard)
  failGuard(): SimpleObject {
    return this.appService.getHello();
  }
}
