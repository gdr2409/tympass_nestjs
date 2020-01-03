import { Controller, Get, Post, Param, Req, Res, Body, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginValidator } from './dto/user.login.validator';
import { UserLoginDto } from './dto/user.login.dto';
@Controller('User')
export class UserController {
	constructor(
		private readonly userService: UserService
	) {}

	@Post('create')
	async createNewUser(@Body() params): Promise<any> {
		await this.userService.createNewUser(params);
		return {
			status: 'OK',
			data: await this.userService.getAllUsers()
		};
	}

	@Get('getAll')
	async getAllUsersData(@Req() req): Promise<any> {
		try {
			const toRet: any = {
				status: 'OK'
			};

			toRet.data = await this.userService.getAllUsers();
			return toRet;
		} catch (err) {
			return { message: 'Error' };
		}
		
	}
}
