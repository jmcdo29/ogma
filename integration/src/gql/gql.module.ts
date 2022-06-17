import { Module, Type } from '@nestjs/common';
import { GraphQLDriver, GraphQLModule } from '@nestjs/graphql';

// import { PubSub } from 'graphql-subscriptions';
import { AppService } from '../app.service';
import { GqlResolver } from './gql.resolver';

@Module({})
export class GqlModule {
  static forFeature(driver: Type<GraphQLDriver>) {
    return {
      module: GqlModule,
      imports: [
        GraphQLModule.forRoot({
          driver,
          /**
           * The mercurius driver uses a two parameter context method instead of a
           * single parameter object like apollo does. To account for this we need
           * come up with some sort of system to determine how to pass req, res,
           * request, and reply so that both apollo and mercurius can work properly
           * inside the test context from a single module setup. A little ugly, but
           * this works and provides the correct output from the interceptor. This
           * would never be used in a production application as well, so I'm not too
           * worried about something like this
           */
          context: async (context: any, mercReply: any) => {
            return {
              req: context.raw ?? context.req,
              res: context.res,
              request: context.request ?? context,
              reply: context.reply ?? mercReply,
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
    };
  }
}
