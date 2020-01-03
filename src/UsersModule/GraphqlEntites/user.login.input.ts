import { InputType, Field } from 'type-graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class UserLoginByUsername {
	@Field()
	username: string;

	@Field()
	password: string;
}

@InputType()
export class UserLoginByPhone {
	@Field()
	@MaxLength(10)
	phone: string;

	@Field()
	password: string;
}