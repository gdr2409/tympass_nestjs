import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class GroupOverview {
	@Field()
	id: number;

	@Field({ nullable: true })
	group_name: string;

	@Field({ nullable: true })
	number_of_participants: number;

	@Field({ nullable: true })
	created_by: string;

	@Field({ nullable: true })
	max_participants: number;
}