import { Injectable, Inject } from '@nestjs/common';
import { Neo4jService } from '../Neo4j/neo4j.service';
import { UserSignUpInput } from './GraphqlEntites/user.signup.input';
import { UserLoginByUsername, UserLoginByPhone } from './GraphqlEntites/user.login.input';
import { AuthTokenService } from '../AuthenticationModule/authentication.token.service';

interface IUser {
	id: number;
	username: string;
	name: string;
	phone: string;
}

@Injectable()
export class UserNeo4jService {
	constructor(
		@Inject(Neo4jService)
		private readonly neo4j: Neo4jService,
		@Inject(AuthTokenService)
		private readonly authTokenService: AuthTokenService,
	) {}

	public userProperties(requiredUser: any): IUser {
		return {
			id: requiredUser.identity.toNumber(),
			username: requiredUser.properties.username,
			phone: requiredUser.properties.phone,
			name: requiredUser.properties.name,
		};
	}

	public async getAllUsers(): Promise<any[]> {

		const queryToExecute = `
		MATCH (n: User)
		RETURN n`;

		const queryResult = await this.neo4j.executeQuery(queryToExecute);

		return queryResult.map((record) => {
			const requiredUser = record._fields[0];
			return this.userProperties(requiredUser);
		});
	}

	public async checkDuplicateUsername(username: string): Promise<any> {
		const queryToExecute = `
		MATCH (n: User)
		WHERE n.username = $username
		RETURN n`;

		const params = {
			username: username.toLowerCase(),
		};

		const result = await this.neo4j.executeQuery(queryToExecute, params);

		if (result.length) {
			throw new Error('Username registered to different user');
		}
	}

	public async checkDuplicatePhone(phone: string): Promise<any> {
		const queryToExecute = `
		MATCH (n: User)
		WHERE n.phone = $phone
		RETURN n`;

		const params = {
			phone,
		};

		const result = await this.neo4j.executeQuery(queryToExecute, params);

		if (result.length) {
			throw new Error('Phone registered to different user');
		}
	}

	public async createNewUser(signUpData: UserSignUpInput): Promise<any> {

		await this.checkDuplicatePhone(signUpData.phone);
		await this.checkDuplicateUsername(signUpData.username);

		const  queryToCreateUser = `
		CREATE ( user: User {
			username: $username,
			name: $name,
			password: $password,
			phone: $phone,
			created_at: datetime().epochMillis
		})
		RETURN user
		`;

		const queryResult = await this.neo4j.executeQuery(queryToCreateUser, {
			username: signUpData.username.toLowerCase(),
			name: signUpData.name,
			phone: signUpData.phone,
			password: signUpData.password,
		});

		const requiredUser = queryResult[0]._fields[0];
		return this.userProperties(requiredUser);
	}

	public async findOneByPhone(phone: string): Promise<any> {
		const queryToExecute = `
		MATCH (n: User)
		WHERE n.phone = $phone
		RETURN n`;

		const queryResult = await this.neo4j.executeQuery(queryToExecute, {
			phone,
		});

		if (queryResult.length) {
			const requiredUser = queryResult[0]._fields[0];
			return { ...this.userProperties(requiredUser), password: requiredUser.properties.password };
		} else {
			return null;
		}
	}

	public async findOneByUsername(username: string): Promise<any> {

		const queryToExecute = `
		MATCH (n: User)
		WHERE n.username = $username
		RETURN n`;

		const queryResult = await this.neo4j.executeQuery(queryToExecute, {
			username: username.toLowerCase(),
		});

		if (queryResult.length) {
			const requiredUser = queryResult[0]._fields[0];
			return { ...this.userProperties(requiredUser), password: requiredUser.properties.password };
		} else {
			return null;
		}
	}

	public async checkUserLoginByUsername(userLoginDto: UserLoginByUsername): Promise<any> {
		const requiredUser = await this.findOneByUsername(userLoginDto.username);

		if (!requiredUser) {
			throw new Error('Invalid user name');
		}

		if (requiredUser.password !== userLoginDto.password) {
			throw new Error('Invalid password');
		}

		// Update auth token here
		const authToken = await this.authTokenService.createNewToken(requiredUser.id);
		return { ...requiredUser, auth_token: authToken };
	}

	public async checkUserLoginByPhone(userLoginDto: UserLoginByPhone): Promise<any> {
		const requiredUser = await this.findOneByPhone(userLoginDto.phone);

		if (!requiredUser) {
			throw new Error('Invalid user name');
		}

		if (requiredUser.password !== userLoginDto.password) {
			throw new Error('Invalid password');
		}

		// Update auth token here
		const authToken = await this.authTokenService.createNewToken(requiredUser.id);
		return { ...requiredUser, auth_token: authToken };
	}

	public async findUser(username?: string, name?: string, phone?: string) {

		const where: any = [], queryParams: any = {};
		const queryAlias: string = 'user';

		if (username) {
			where.push(`${queryAlias}.username = $username `);
			queryParams.username = username.toLowerCase();
		}

		if (name) {
			where.push(`${queryAlias}.name = $name `);
			queryParams.name = name;
		}

		if (phone) {
			where.push(`${queryAlias}.phone = $phone `);
			queryParams.phone = phone;
		}

		let query = `MATCH (${queryAlias}: User)`;

		if (where.length) {
			query += `\nWHERE ${where.join(' AND ')}`;
		}

		query += `\nRETURN ${queryAlias}`;

		const queryResult = await this.neo4j.executeQuery(query, queryParams);

		return queryResult.map((record) => {
			const requiredUser = record._fields[0];
			return this.userProperties(requiredUser);
		});
	}
}
