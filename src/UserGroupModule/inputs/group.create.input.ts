import { InputType, Field } from 'type-graphql';
import { Max } from 'class-validator';

@InputType()
export class CreateGroupInput {
	@Field()
	group_name: string

	@Field()
	@Max(25)
	max_participants: number
}