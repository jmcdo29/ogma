import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from '../app.service';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      context: ({ req, res }) => ({ req, res }),
      autoSchemaFile: 'schema.gql',
    }),
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
