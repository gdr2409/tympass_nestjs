import { Field, ObjectType } from 'type-graphql';
import { IsString, MaxLength, IsOptional } from 'class-validator';

@ObjectType()
export class UserLoginOutput {
	@Field()
	public id: number;

	@Field()
	public name: string;

	@Field()
	public username: string;

	@Field()
	@MaxLength(10)
	public phone: string;

	@Field({ nullable: true })
	public fcm_token: string;

	@Field()
	public auth_token: string;
}
