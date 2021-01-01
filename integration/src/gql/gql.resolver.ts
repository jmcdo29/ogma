import { BadRequestException } from '@nestjs/common';
import { Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { OgmaSkip } from '@ogma/nestjs-module';
// import { PubSub } from 'graphql-subscriptions';
import { AppService } from '../app.service';
import { SimpleObject } from './simple-object.model';

@Resolver(() => SimpleObject)
export class GqlResolver {
  constructor(
    private readonly appService: AppService, // @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

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
    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const obj = this.appService.getHello();
    // this.pubSub.publish('subscribed', { subscribed: obj });
    return obj;
  }

  /* @Subscription(() => SimpleObject)
  subscribed() {
    return this.pubSub.asyncIterator('subscribed');
  } */
}
