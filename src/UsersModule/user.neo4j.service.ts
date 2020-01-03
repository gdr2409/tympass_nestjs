import { Injectable, Inject } from "@nestjs/common";
import { Neo4jService } from '../Neo4j/neo4j.service';
import { UserSignUpInput } from "./GraphqlEntites/user.signup.input";
import { get } from 'lodash';

@Injectable()
export class UserNeo4jService {
	constructor(
		@Inject(Neo4jService)
		private readonly neo4j: Neo4jService
	) {}

	async getAllUsers(): Promise<any[]> {

		const queryToExecute = `
		MATCH (n: User)
		RETURN n`;

		const queryResult = await this.neo4j.executeQuery(queryToExecute, undefined);

		return queryResult.map(record => {
			const requiredUser = record._fields[0];
			return {
				id: requiredUser.identity.low,
				...requiredUser.properties
			};
		});
	}

	async createNewUser(signUpData: UserSignUpInput): Promise<any> {

		const queryToExecute = `
		MATCH (n: User)
		WHERE n.username = $username
		RETURN n`;

		const params = {
			username: signUpData.username
		};

		const result = await this.neo4j.executeQuery(queryToExecute, params);

		if (result.length) {
			throw new Error('Username already exists');
		}

		const  queryToCreateUser = `
		CREATE ( user: User {
			username: $username,
			name: $name,
			password: $password,
			phone: $phone
		})
		RETURN user
		`;

		const queryResult = await this.neo4j.executeQuery(queryToCreateUser, {
			username: signUpData.username,
			name: signUpData.name,
			phone: signUpData.phone,
			password: signUpData.password
		});

		const requiredUser = queryResult[0]._fields[0];
		return {
			id: requiredUser.identity.low,
			...requiredUser.properties
		};
	}

	async findOneByUsername(username: string): Promise<any> {

		const queryToExecute = `
		MATCH (n: User)
		WHERE n.username = $username
		RETURN n`;

		const queryResult = await this.neo4j.executeQuery(queryToExecute, {
			username: username
		});

		const requiredUser = queryResult[0]._fields[0];
		return {
			id: requiredUser.identity.low,
			...requiredUser.properties
		};
	}
}