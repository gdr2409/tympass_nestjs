import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntityGQL } from './GraphqlEntites/user.entity.gql';
import { UserSignUpInput } from './GraphqlEntites/user.signup.input';
import { UserLoginByPhone, UserLoginByUsername } from './GraphqlEntites/user.login.input';
import { UseGuards } from '@nestjs/common';
import { AuthenticateUser } from './../AuthenticationModule/user.authenticate';
import { UserNeo4jService } from './user.neo4j.service';
import { UserLoginOutput } from './GraphqlEntites/user.login.output';
import { GetUserData } from './GraphqlEntites/user.data.query';

@Resolver()
export class UserResolver {
	constructor(private readonly userService: UserService,
				private readonly userServiceNeo4j: UserNeo4jService) {}

	@UseGuards(AuthenticateUser)
	@Query((returns) => [UserEntityGQL], { name: 'GetAllUsers' })
	public async getAllUsers() {
		return await this.userServiceNeo4j.getAllUsers();
	}

	@UseGuards(AuthenticateUser)
	@Query((returns) => [UserEntityGQL], { name: 'Userdata' })
	public async getUserData(@Args() { username, name, phone }: GetUserData) {

	  const result = await this.userServiceNeo4j.findUser(username, name, phone);

	  if (!result) {
		  throw new Error('Not found');
	  }

	  return result;
	}

	@Mutation((returns) => UserLoginOutput, { name: 'UserLoginByUsername' })
	public async userLoginByUsername(@Args('loginData') loginData: UserLoginByUsername) {
		return await this.userServiceNeo4j.checkUserLoginByUsername(loginData);
	}

	@Mutation((returns) => UserLoginOutput, { name: 'UserLoginByPhone' })
	public async userLoginByPhone(@Args('loginData') loginData: UserLoginByPhone) {
		return await this.userServiceNeo4j.checkUserLoginByPhone(loginData);
	}

	@Mutation((returns) => UserEntityGQL, { name: 'UserSignUp'})
	public async userSignUp(@Args('signUpData') signUpData: UserSignUpInput) {
		const result = await this.userServiceNeo4j.createNewUser(signUpData);

		if (!result) {
			throw new Error('Error while sign up');
		}

		return result;
	}
}
