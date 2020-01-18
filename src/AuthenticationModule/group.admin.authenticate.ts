import { CanActivate, Injectable, ExecutionContext, Inject, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Neo4jService } from '../Neo4j/neo4j.service';

@Injectable()
export class AuthenticateGroupAdmin implements CanActivate {
	constructor(
		@Inject(Neo4jService)
		private readonly neo4j: Neo4jService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const req = ctx.getContext().req;
		const userId = req.headers['user-id'];
		const groupId = req.headers['group-id'];

		if (!userId) {
			throw new BadRequestException('User Id should be present');
		}

		const result = await this.neo4j.executeQuery(`
			MATCH (user: User)
				WHERE id(user) = $userId
			MATCH (group: Group)
				WHERE id(group) = $groupId
			MATCH (user)-[r:GROUP_ADMIN]->(group)
			RETURN r`,
			{
				userId: parseInt(userId),
				groupId: parseInt(groupId)
			}
		);

		if (!result.length) {
			throw new UnauthorizedException();
		}

		return true;
	}
}
