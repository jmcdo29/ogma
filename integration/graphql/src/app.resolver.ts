import { BadRequestException } from '@nestjs/common';
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { OgmaSkip } from '@ogma/nestjs-module';
import { PubSub } from 'graphql-subscriptions';
import { AppService } from './app.service';
import { SimpleObject } from './models';

@Resolver(() => SimpleObject)
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly pubSub: PubSub,
  ) {}

  @Query(() => SimpleObject)
  getQuery(): SimpleObject {
    const hello = this.appService.getHello();
    this.pubSub.publish('saidHello', hello);
    return hello;
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

  @Subscription(() => SimpleObject)
  saidHello() {
    return this.pubSub.asyncIterator<SimpleObject>('saidHello');
  }
}
