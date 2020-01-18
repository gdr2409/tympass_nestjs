import { Injectable, Inject } from '@nestjs/common';
import { Neo4jService } from '../Neo4j/neo4j.service';
import { CreateGroupInput } from './inputs/group.create.input';

@Injectable()
export class UserGroupService {

	constructor (
		@Inject(Neo4jService)
		private readonly neo4j: Neo4jService
	) {}

	async getAllGroups(userId: number): Promise<any> {
		const queryResult = await this.neo4j.executeQuery(`
			MATCH (user: User)
				WHERE id(user) = $userId
			MATCH (user:User)-[r:IN_GROUP]-(groups:GROUP)
			RETURN groups`,
			{ userId }
		);

		return queryResult.map(record => {
			const field = record._fields[0];
			return {
				id: field.identity.low,
				...field.properties
			}
		});
	}

	async createNewGroup(groupData: CreateGroupInput, createdBy: string): Promise<any> {
		const groupQueryResult = await this.neo4j.executeQuery(`
			CREATE (n:Group {
				group_name: $groupName,
				max_participants: $maxParticipants,
				created_at: datetime().epochMillis
			})
			WITH n
			MATCH (user:User)
				WHERE id(user) = $userId
			CREATE (user)-[r:CREATED_BY]->(n)
			CREATE (user)-[r1:JOINED]->(n)
			CREATE (user)-[r2:GROUP_ADMIN]->(n)
			RETURN n`,
			{ 
				groupName: groupData.group_name,
				maxParticipants: groupData.max_participants,
				userId: parseInt(createdBy)
			}
		);

		const userQueryResult = await this.neo4j.executeQuery(`
			MATCH (n: User)
				WHERE id(n) = $userId
			RETURN n`,
			{ userId: parseInt(createdBy) }
		);

		const requiredGroup = groupQueryResult[0]._fields[0];
		const requiredUser = userQueryResult[0]._fields[0];

		return {
			id: requiredGroup.identity.low,
			...requiredGroup.properties,
			created_by: requiredUser.properties.username,
			number_of_participants: 1
		};
	}

	async addUserToGroup (userId: string, groupId: string): Promise<void> {
		const query = `
			MATCH (user: User)
				WHERE id(user) = $userId
			MATCH (group: Group)
				WHERE id(group) = $groupId
			CREATE (user)-[r:JOINED]-(group)
			MATCH (n: User)-[:JOINED]-(group)
			RETURN group as group, count(n) as number_of_participants, collect(DISTINCT n) as participants
		`;

		const queryResult = await this.neo4j.executeQuery(
			query,
			{
				userId: parseInt(userId),
				groupId: parseInt(groupId)
			}
		);

		


	}
}