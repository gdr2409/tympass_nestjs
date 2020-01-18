import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GroupDetails } from './outputs/group.overview';
import { UserGroupService } from './user.group.service';
import { CreateGroupInput } from './inputs/group.create.input';
import { AuthenticateUser } from '../AuthenticationModule/user.authenticate';
import { UseGuards, InternalServerErrorException } from '@nestjs/common';
import { Context } from '@nestjs/graphql';
import { AuthenticateGroupAdmin } from '../AuthenticationModule/group.admin.authenticate';

@Resolver (of => GroupDetails)
export class GroupDetailsResolver {
	constructor(
		private readonly groupService: UserGroupService
	) {}

	@UseGuards(AuthenticateUser)
	@Query(returns => [GroupDetails], { name: 'GetAllGroups' })
	async getAllGroups(@Args('userId') userId: number) {
		return await this.groupService.getAllGroups(userId);
	}

	@UseGuards(AuthenticateUser)
	@Mutation(returns => GroupDetails, { name: 'CreateNewGroup'})
	async createNewGroup(@Args('newGroupData') groupData: CreateGroupInput, @Context() context) {
		const userId = context.req.headers['user-id'];
		const requiredGroup = await this.groupService.createNewGroup(groupData, userId);

		if (!requiredGroup) {
			throw new InternalServerErrorException('Error while creating Group');
		}

		return requiredGroup;
	}

	@UseGuards(AuthenticateUser)
	@UseGuards(AuthenticateGroupAdmin)
	@Mutation(returns => GroupDetails, { name: 'EditGroup'})
	async editGroup(@Args('editGroupData') groupData: CreateGroupInput) {

	}

}

