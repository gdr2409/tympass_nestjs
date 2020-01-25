import { ObjectType, Field } from 'type-graphql';
import { UserEntityGQL } from '../../UsersModule/GraphqlEntites/user.entity.gql';

@ObjectType()
export class GroupDetails {
	@Field()
	public id: number;

	@Field()
	public group_name: string;

	@Field()
	public number_of_participants: number;

	@Field({ nullable: true })
	public created_by: string;

	@Field()
	public max_participants: number;

	@Field((type) => [UserEntityGQL])
	public users: UserEntityGQL[];
}
