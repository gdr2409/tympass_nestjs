import { ArgsType, Field } from 'type-graphql';
@ArgsType()
export class GetUserData {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phone?: string;
}