import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from '../app.service';
import { GqlResolver } from './gql.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req, res }) => ({ req, res }),
      autoSchemaFile: true,
    }),
  ],
  providers: [AppService, GqlResolver],
})
export class GqlModule {}
