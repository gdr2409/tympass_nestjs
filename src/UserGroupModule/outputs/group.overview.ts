import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class GroupOverview {
	@Field()
	public id: number;

	@Field({ nullable: true })
	public group_name: string;

	@Field({ nullable: true })
	public number_of_participants: number;

	@Field({ nullable: true })
	public created_by: string;

	@Field({ nullable: true })
	public max_participants: number;
}
