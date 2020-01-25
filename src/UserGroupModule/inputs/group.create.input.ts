import { InputType, Field } from 'type-graphql';
import { Max } from 'class-validator';

@InputType()
export class CreateGroupInput {
	@Field()
	public group_name: string;

	@Field()
	@Max(25)
	public max_participants: number;
}
