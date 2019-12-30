import { Field, ObjectType } from 'type-graphql';
import { IsString, MaxLength, IsOptional } from 'class-validator';

@ObjectType()
export class UserEntityGQL {
	@Field()
	@IsString()
	name: string;

	@Field()
	@IsString()
	username: string;

	@Field()
	@IsString()
	@MaxLength(10)
	phone: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	fcm_token: string

	@Field()
	is_active: boolean
}