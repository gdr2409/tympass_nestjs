import { Field, ObjectType } from 'type-graphql';
import { IsString, MaxLength, IsOptional } from 'class-validator';

@ObjectType()
export class UserLoginOutput {
	@Field()
	id: number;

	@Field()
	name: string;

	@Field()
	username: string;

	@Field()
	@MaxLength(10)
	phone: string

	@Field({ nullable: true })
	fcm_token: string

	@Field()
	auth_token: string
}