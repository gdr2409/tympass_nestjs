import { InputType, Field } from 'type-graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class UserSignUpInput {
	@Field()
	public name: string;

	@Field()
	public username: string;

	@Field()
	public password: string;

	@Field()
	@MaxLength(10)
	public phone: string;

	@Field({ nullable: true })
	public fcm_token: string;
}
