import { ObjectType, Field } from "type-graphql";
import { UserEntityGQL } from '../../UsersModule/GraphqlEntites/user.entity.gql'

@ObjectType()
export class GroupDetails {
	@Field()
	id: number;

	@Field()
	group_name: string;

	@Field()
	number_of_participants: number;

	@Field({ nullable: true })
	created_by: string;

	@Field()
	max_participants: number;

	@Field(type => [UserEntityGQL])
	users: UserEntityGQL[];
}