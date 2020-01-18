import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class GroupDetails {
	@Field()
	id: number;

	@Field()
	group_name: string;

	@Field()
	number_of_participants: number;

	@Field()
	created_by: string;

	@Field()
	max_participants: number;
}