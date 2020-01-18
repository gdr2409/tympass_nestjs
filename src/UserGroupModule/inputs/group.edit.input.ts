import { InputType, Field } from 'type-graphql';
import { Max } from 'class-validator';

@InputType()
export class EditGroupInput {
	@Field({ nullable: true })
	group_name: string

	@Field({ nullable: true })
	@Max(25)
	max_participants: number
}