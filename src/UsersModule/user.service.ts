import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from './user.entity';
import { Repository, getManager } from 'typeorm';
import { UserSignUpInput } from './GraphqlEntites/user.signup.input';
import { UserLoginByUsername, UserLoginByPhone } from './GraphqlEntites/user.login.input';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserData)
		private readonly userRespository: Repository<UserData>,
	) {}

	public async getAllUsers(): Promise<UserData[]> {
		return this.userRespository.find();
	}

	public async findOneByUsername(username: string): Promise<UserData> {

		const manager = getManager();
		const result = await this.userRespository.query('SELECT * FROM user_data WHERE username = $1', [username]);
		// const result = await this.userRespository.findOne({ username: username });
		if (!result.length) {
			return null;
		}
		return result[0];
	}

	public async createNewUser(signUpData: UserSignUpInput): Promise<UserData> {

		const requiredUser = await this.userRespository.findOne({ username: signUpData.username });

		if (requiredUser) {
			throw new Error('Username already exists, try different one!');
		}

		const userToCreate = {
			username: signUpData.username,
			password: signUpData.password,
			name: signUpData.name,
			phone: signUpData.phone,
		};

		await this.userRespository.save(userToCreate);

		return await this.userRespository.findOne({ username: signUpData.username });
	}

	public async checkUserLoginByUsername(userLoginDto: UserLoginByUsername): Promise<UserData> {

		const requiredUser = await this.userRespository.findOne({ username: userLoginDto.username });

		if (!requiredUser) {
			throw new Error('Invalid user name');
		}

		if (requiredUser.password !== userLoginDto.password) {
			throw new Error('Invalid password');
		}

		// Update auth token here
		requiredUser.is_active = true;
		await this.userRespository.save(requiredUser);
		return requiredUser;
	}

	public async checkUserLoginByPhone(userLoginDto: UserLoginByPhone): Promise<UserData> {

		const requiredUser = await this.userRespository.findOne({ phone: userLoginDto.phone });

		if (!requiredUser) {
			throw new Error('Invalid phone');
		}

		if (requiredUser.password !== userLoginDto.password) {
			throw new Error('Invalid password');
		}

		// Update auth token here
		requiredUser.is_active = true;
		await this.userRespository.save(requiredUser);
		return requiredUser;
	}

	public async validateUserForUserDetails(currentUserId: number, requestedUsername: string): Promise<boolean> {
		const currentUser = await this.userRespository.findOne({ id: currentUserId });
		const requiredUser = await this.userRespository.findOne({ username: requestedUsername });

		if (currentUser.id !== requiredUser.id) {
			return false;
		}

		return true;
	}
}
