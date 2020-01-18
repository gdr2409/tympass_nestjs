import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateGroupInput {
	@Field()
	group_name: string

	@Field()
	max_participants: number
}