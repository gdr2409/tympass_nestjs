import { InputType, Field } from 'type-graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class UserLoginByUsername {
	@Field()
	public username: string;

	@Field()
	public password: string;
}

// tslint:disable-next-line: max-classes-per-file
@InputType()
export class UserLoginByPhone {
	@Field()
	@MaxLength(10)
	public phone: string;

	@Field()
	public password: string;
}
