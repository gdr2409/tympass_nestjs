import { Injectable, Inject } from '@nestjs/common';
import { Neo4jService } from '../Neo4j/neo4j.service';
import { auth } from 'neo4j-driver/types/v1';
const uuid = require('uuid/v4');

@Injectable()
export class AuthTokenService {
	constructor(
		@Inject(Neo4jService)
		private readonly neo4j: Neo4jService,
	) {}

	public async createNewToken(userId: string): Promise<any> {
		const authToken = uuid();
		await this.neo4j.executeQuery(
			`CREATE (n: AuthToken {
				user_id: $userId,
				expiry_at: (datetime() + duration({ weeks: 1 })).epochMillis,
				token: $authToken
			})
			WITH n
			MATCH (user: User)
			WHERE id(user) = $userId
			CREATE (user)-[rel: AUTH_TOKEN]->(n)
			RETURN n`,
			{
				userId,
				authToken,
			},
		);

		return authToken;
	}
}
