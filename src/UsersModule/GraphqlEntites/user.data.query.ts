import { ArgsType, Field } from 'type-graphql';
@ArgsType()
export class GetUserData {
  @Field({ nullable: true })
  public username?: string;

  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public phone?: string;
}
