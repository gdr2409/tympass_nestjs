import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntityGQL } from './GraphqlEntites/user.entity.gql';
import { UserSignUpInput } from './GraphqlEntites/user.signup.input';
import { UserLoginByPhone, UserLoginByUsername } from './GraphqlEntites/user.login.input';
import { UseGuards } from '@nestjs/common';
import { AuthenticateUser } from './../AuthenticationModule/user.authenticate';
import { UserNeo4jService } from './user.neo4j.service';
@Resolver(of => UserEntityGQL)
export class UserResolver {
	constructor(private readonly userService: UserService,
		private readonly userServiceNeo4j: UserNeo4jService) {}

	@UseGuards(AuthenticateUser)
	@Query(returns => [UserEntityGQL], { name: 'GetAllUsers' })
	async getAllUsers() {
		return await this.userServiceNeo4j.getAllUsers();
	}

	@UseGuards(AuthenticateUser)
	@Query(returns => UserEntityGQL, { name: 'Userdata' })
	async getUserData(@Args('username') username: string, @Context() context) {

	  const result = await this.userServiceNeo4j.findOneByUsername(username);

	  if (!result) {
		  throw new Error('Not found');
	  }

	  return result;
	}

	@Mutation(returns => UserEntityGQL, { name: 'UserLoginByUsername' })
	async userLoginByUsername(@Args('loginData') loginData: UserLoginByUsername) {
		return await this.userService.checkUserLoginByUsername(loginData);
	}

	@Mutation(returns => UserEntityGQL, { name: 'UserLoginByPhone' })
	async userLoginByPhone(@Args('loginData') loginData: UserLoginByPhone) {
		return await this.userService.checkUserLoginByPhone(loginData);
	}

	@Mutation(returns => UserEntityGQL, { name: 'UserSignUp'})
	async userSignUp(@Args('signUpData') signUpData: UserSignUpInput) {
		const result = await this.userServiceNeo4j.createNewUser(signUpData);

		if (!result) {
			throw new Error('Error while sign up');
		}

		return result;
	}
}
