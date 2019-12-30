import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntityGQL } from './GraphqlEntites/user.entity.gql';
import { UserSignUpInput } from './GraphqlEntites/user.signup.input';

@Resolver(of => UserEntityGQL)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(returns => UserEntityGQL, { name: 'userdata' })
	async getUserData(@Args('username') username: string) {
	  const result = await this.userService.findOneByUsername(username);

	  if (!result) {
		  throw new Error('Not found');
	  }

	  return result;
	}

	@Mutation(returns => UserEntityGQL, { name: 'userSignUp'})
	async userSignUp(@Args('signUpData') signUpData: UserSignUpInput) {
		const result = await this.userService.createNewUser(signUpData);

		if (!result) {
			throw new Error('Error while sign up');
		}

		return result;
	}
}
