import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SimpleObject {
  @Field()
  message!: string;
}
