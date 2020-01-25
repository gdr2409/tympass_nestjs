import { CanActivate, Injectable, ExecutionContext, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Neo4jService } from '../Neo4j/neo4j.service';

const assert = require('assert');
const moment = require('moment');
@Injectable()
export class AuthenticateUser implements CanActivate {
	constructor(
		@Inject(Neo4jService)
		private readonly neo4j: Neo4jService,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req;
		const userId = req.headers['user-id'];
		const authToken = req.headers['access-token'];

		if (!userId) {
			throw new BadRequestException('User Id should be present');
		}

		if (!authToken) {
			throw new BadRequestException('Auth token should be present');
		}

		// const currentTime = moment().format('YYYY-MM-DDThh:mm:ss');

		// const entityManager = getManager();
		// const result = await entityManager.query('SELECT * FROM user_data where id = $1', [userId]);

		const result = await this.neo4j.executeQuery(
			`MATCH (authToken: AuthToken)
				WHERE authToken.token = $authToken
				AND authToken.user_id = $userId
				AND authToken.expiry_at >= datetime().epochMillis
			RETURN authToken`, { authToken, userId: parseInt(userId) },
		);

		if (!result.length) {
			throw new UnauthorizedException();
		}

		return true;
	}
}
