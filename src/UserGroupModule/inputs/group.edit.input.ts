import { InputType, Field } from 'type-graphql';
import { Max } from 'class-validator';

@InputType()
export class EditGroupInput {
	@Field({ nullable: true })
	public group_name: string;

	@Field({ nullable: true })
	@Max(25)
	public max_participants: number;
}
