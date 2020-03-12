import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { OgmaModule } from '../dist';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppMicroserviceController } from './app.microservice.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    OgmaModule.forRoot(OgmaModule, {
      interceptor: true,
      service: {
        application: 'Testing',
        color: true,
      },
    }),
  ],
  controllers: [AppController, AppMicroserviceController],
  providers: [AppService, AppResolver, AppGateway],
})
export class AppModule {}
