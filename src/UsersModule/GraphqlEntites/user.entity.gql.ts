import { Field, ObjectType } from 'type-graphql';
import { IsString, MaxLength, IsOptional } from 'class-validator';

@ObjectType()
export class UserEntityGQL {
	@Field()
	public id: number;

	@Field()
	@IsString()
	public name: string;

	@Field()
	@IsString()
	public username: string;

	@Field()
	@IsString()
	@MaxLength(10)
	public phone: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	public fcm_token: string;

	@Field()
	public is_active: boolean;
}
