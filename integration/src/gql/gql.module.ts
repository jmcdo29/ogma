import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
// import { PubSub } from 'graphql-subscriptions';
import { AppService } from '../app.service';
import { GqlResolver } from './gql.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: async ({ req, res, request, reply }) => {
        return {
          req,
          res,
          request,
          reply,
        };
      },
      autoSchemaFile: true,
      playground: false,
      // installSubscriptionHandlers: true,
    }),
  ],
  providers: [
    AppService,
    GqlResolver,
    /* {
      provide: 'PUB_SUB',
      useClass: PubSub,
    }, */
  ],
})
export class GqlModule {}
