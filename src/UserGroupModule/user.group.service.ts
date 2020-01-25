import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Neo4jService } from '../Neo4j/neo4j.service';
import { CreateGroupInput } from './inputs/group.create.input';
import { EditGroupInput } from './inputs/group.edit.input';
import { UserNeo4jService } from '../UsersModule/user.neo4j.service';

@Injectable()
export class UserGroupService {

	constructor(
		@Inject(Neo4jService)
		private readonly neo4j: Neo4jService,
		@Inject(UserNeo4jService)
		private readonly userService: UserNeo4jService,
	) {}

	public groupProperties(requiredGroup: any): object {
		return {
			id: requiredGroup.identity.toNumber(),
			group_name: requiredGroup.properties.group_name,
			max_participants: requiredGroup.properties.max_participants,
		};
	}

	public userProperties(requiredUser: any): any {
		return {
			id: requiredUser.identity.toNumber(),
			username: requiredUser.properties.username,
			phone: requiredUser.properties.phone,
			name: requiredUser.properties.name,
		};
	}

	public async getAllGroups(userId: number): Promise<any> {
		const queryResult = await this.neo4j.executeQuery(`
			MATCH (user: User)
				WHERE id(user) = $userId
			MATCH (user:User)-[r:IN_GROUP]-(groups:GROUP)
			RETURN groups`,
			{ userId },
		);

		return queryResult.map((record) => {
			const field = record._fields[0];
			return {
				id: field.identity.low,
				...field.properties,
			};
		});
	}

	public async checkIfGroupExists(groupName: string): Promise<boolean> {
		const queryResult = await this.neo4j.executeQuery(`
			MATCH (g: Group)
				WHERE g.group_name = $groupName
			RETURN g`,
			{
				groupName: groupName.toLowerCase(),
			},
		);

		if (queryResult.length) {
			return true;
		}
		return false;
	}

	public async createNewGroup(groupData: CreateGroupInput, createdBy: string): Promise<any> {

		const checkDuplicateGroupName = await this.checkIfGroupExists(groupData.group_name);

		if (checkDuplicateGroupName) {
			throw new BadRequestException('Group name not unique, please try different one!');
		}

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
				groupName: groupData.group_name.toLowerCase(),
				maxParticipants: groupData.max_participants,
				userId: parseInt(createdBy),
			},
		);

		const userQueryResult = await this.neo4j.executeQuery(`
			MATCH (n: User)
				WHERE id(n) = $userId
			RETURN n`,
			{ userId: parseInt(createdBy) },
		);

		const requiredGroup = groupQueryResult[0]._fields[0];
		const requiredUser = userQueryResult[0]._fields[0];

		return {
			...this.groupProperties(requiredGroup),
			created_by: requiredUser.properties.username,
			number_of_participants: 1,
		};
	}

	public async checkIfAlreadyAdded(userId: number, groupId: number): Promise<boolean> {

		const queryResult = await this.neo4j.executeQuery(
			`MATCH (u: User)-[r:JOINED]-(g: Group)
				WHERE id(u) = $userId AND id(g) = $groupId
			RETURN r
			`,
			{
				userId,
				groupId,
			},
		);

		if (queryResult.length) {
			return true;
		}

		return false;
	}

	public async addUserToGroup(userId: number, groupId: number): Promise<any> {

		const checkIfAlreadyAdded = await this.checkIfAlreadyAdded(userId, groupId);

		if (checkIfAlreadyAdded) {
			throw new BadRequestException('User already present in group');
		}

		const query = `
			MATCH (user: User)
				WHERE id(user) = $userId
			MATCH (group: Group)
				WHERE id(group) = $groupId
			CREATE (user)-[r:JOINED]->(group)
			WITH r
			MATCH (n: User)-[:JOINED]-(group)
			RETURN group as group, count(DISTINCT n) as number_of_participants, collect(DISTINCT n) as participants
		`;

		const queryResult = await this.neo4j.executeQuery(
			query,
			{
				userId,
				groupId,
			},
		);

		const requiredGroup = queryResult[0]._fields[0];
		const numParticipants = queryResult[0]._fields[1].toNumber();
		const requiredUsers = queryResult[0]._fields[2];

		return {
			...this.groupProperties(requiredGroup),
			number_of_participants: numParticipants,
			users: requiredUsers.map((elem) => {
				return this.userService.userProperties(elem);
			}),
		};
	}

	public async editGroup(groupData: EditGroupInput, groupId: number): Promise<any> {

		const alias: string = 'group';
		const queryParams: any = { groupId };
		const update: any = [];

		let query = `
		MATCH (${alias}: Group)
			WHERE id(${alias}) = $groupId`;

		if (groupData.group_name) {
			update.push(`${alias}.group_name = $groupName`);
			queryParams.groupName = groupData.group_name;
		}

		if (groupData.max_participants) {
			update.push(`${alias}.max_participants = $maxParticipants`);
			queryParams.maxParticipants = groupData.max_participants;
		}

		if (update.length) {
			query += `\n SET ${update.join(', ')}`;
		}

		query += `\n RETURN ${alias}`;

		const queryResult = await this.neo4j.executeQuery(
			query,
			queryParams,
		);

		if (!queryResult.length) {
			throw new BadRequestException('Invalid group Id');
		}

		const requiredGroup = queryResult[0]._fields[0];
		return this.groupProperties(requiredGroup);
	}

	public async leaveGroup(userId: number, groupId: number): Promise<any> {

		const adminQueryResult = await this.neo4j.executeQuery(`
			MATCH (n: User)-[r:GROUP_ADMIN]-(g: Group)
				WHERE id(n) = $userId AND id(g) = $groupId
			RETURN r
			`,
			{
				userId,
				groupId,
			},
		);

		if (adminQueryResult.length) {
			throw new BadRequestException('Admin cannot leave, admin can delete');
		}

		const queryResult = await this.neo4j.executeQuery(`
			MATCH (u: User)-[r:JOINED]-(g:Group)
				WHERE id(u) = $userId AND id(g) = $groupId
			DETACH DELETE r
			RETURN g
			`,
			{
				userId,
				groupId,
			},
		);

		return { id: groupId };
	}

	public async getGroupDetails(groupId: number): Promise<any> {
		const queryResult = await this.neo4j.executeQuery(`
			MATCH (g: Group)
				WHERE id(g) = $groupId
			MATCH (creator: User)-[:CREATED_BY]-(g)
			MATCH (n: User)-[:JOINED]-(g)
			RETURN
				g,
				creator.username as created_by,
				count(DISTINCT n) as number_of_participants,
				collect(DISTINCT n) as participants
			`,
			{
				groupId,
			},
		);

		if (!queryResult.length) {
			throw new BadRequestException('Invalid group Id');
		}

		const requiredGroup = queryResult[0]._fields[0];
		const requiredUsers = queryResult[0]._fields[3];

		return {
			...this.groupProperties(requiredGroup),
			created_by: queryResult[0]._fields[1],
			number_of_participants: queryResult[0]._fields[2].toNumber(),
			users: requiredUsers.map((elem) => {
				return this.userService.userProperties(elem);
			}),
		};
	}

	public async deleteGroup(groupId: number) {

		// TODO take care of deletion when group is linked to some poll
		const queryResult = await this.neo4j.executeQuery(`
			MATCH ()-[r]-(g: Group)
				WHERE id(g) = $groupId
			DETACH DELETE r
			`,
			{
				groupId,
			},
		);

		return { id: groupId };
	}
}
