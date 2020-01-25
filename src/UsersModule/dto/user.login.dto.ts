import { IsString } from 'class-validator';

export class UserLoginDto {
	@IsString()
	public username: string;

	@IsString()
	public password: string;
}
