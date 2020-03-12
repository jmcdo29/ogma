import { Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { SimpleObject } from './graphql-return';

@Resolver(() => SimpleObject)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => SimpleObject)
  getMessage(): object {
    return this.appService.getSimpleMessage();
  }
}
