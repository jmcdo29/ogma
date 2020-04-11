import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { OgmaModule } from '@ogma/nestjs-module';
import { GraphQLParser } from '@ogma/platform-graphql';
import { PubSub } from 'graphql-subscriptions';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    OgmaModule.forRoot({
      interceptor: {
        gql: GraphQLParser,
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => {
        return { req, res };
      },
      installSubscriptionHandlers: true,
    }),
  ],
  providers: [AppResolver, AppService, PubSub],
})
export class AppModule {}
