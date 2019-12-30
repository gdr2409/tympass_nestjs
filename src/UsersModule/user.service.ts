import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserData } from './user.entity';
import { Repository, getManager } from "typeorm";
import { UserSignUpInput } from './GraphqlEntites/user.signup.input';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserData)
		private readonly userRespository: Repository<UserData>
	) {}

	async getAllUsers(): Promise<UserData[]> {
		return this.userRespository.find();
	}

	async findOneByUsername(username: string): Promise<UserData> {

		const manager = getManager();
		const result = await this.userRespository.query('SELECT * FROM user_data WHERE username = $1', [username]);
		//const result = await this.userRespository.findOne({ username: username });
		if (!result.length) {
			return null;
		}
		return result[0];
	}

	async createNewUser(signUpData: UserSignUpInput): Promise<UserData> {

		const requiredUser = await this.userRespository.findOne({ username: signUpData.username });

		if (requiredUser) {
			throw new Error('Username already exists, try different one!');
		}

		const userToCreate = {
			username: signUpData.username,
			password: signUpData.password,
			name: signUpData.name,
			phone: signUpData.phone
		};

		await this.userRespository.save(userToCreate);

		return await this.userRespository.findOne({ username: signUpData.username });
	}
}