import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SimpleObject {
  @Field()
  key: string;
}
