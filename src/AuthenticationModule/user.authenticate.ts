import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { getManager } from "typeorm";

@Injectable()
export class AuthenticateUser implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req;
		const userId = req.headers['user-id'];

		const entityManager = getManager();
		const result = await entityManager.query('SELECT * FROM user_data where id = $1', [userId]);

		if (!result.length) {
			throw new Error('Invalid user Id');
		}

		const requiredUser = result[0];

		//Compare auth token here
		return true;
	}
}
