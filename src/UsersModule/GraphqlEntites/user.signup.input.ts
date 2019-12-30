import { InputType, Field } from 'type-graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class UserSignUpInput {
	@Field()
	name: string;

	@Field()
	username: string;

	@Field()
	password: string;

	@Field()
	@MaxLength(10)
	phone: string;

	@Field({ nullable: true })
	fcm_token: string
}