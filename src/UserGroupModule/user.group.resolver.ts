import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { UseGuards, InternalServerErrorException } from '@nestjs/common';

import { GroupOverview } from './outputs/group.overview';
import { GroupDetails } from './outputs/group.details';
import { UserGroupService } from './user.group.service';
import { CreateGroupInput } from './inputs/group.create.input';
import { EditGroupInput } from './inputs/group.edit.input';
import { AuthenticateUser } from '../AuthenticationModule/user.authenticate';
import { AuthenticateGroupAdmin } from '../AuthenticationModule/group.admin.authenticate';

@Resolver ()
export class GroupDetailsResolver {
	constructor(
		private readonly groupService: UserGroupService,
	) {}

	@UseGuards(AuthenticateUser)
	@Query((returns) => [GroupOverview], { name: 'GetAllGroups' })
	public async getAllGroups(@Args('userId') userId: number) {
		return await this.groupService.getAllGroups(userId);
	}

	@UseGuards(AuthenticateUser)
	@Mutation((returns) => GroupOverview, { name: 'CreateNewGroup'})
	public async createNewGroup(@Args('newGroupData') groupData: CreateGroupInput, @Context() context) {
		const userId = context.req.headers['user-id'];
		const requiredGroup = await this.groupService.createNewGroup(groupData, userId);

		if (!requiredGroup) {
			throw new InternalServerErrorException('Error while creating Group');
		}

		return requiredGroup;
	}

	@UseGuards(AuthenticateUser)
	@UseGuards(AuthenticateGroupAdmin)
	@Mutation((returns) => GroupOverview, { name: 'EditGroup'})
	public async editGroup(@Args('editGroupData') groupData: EditGroupInput, @Context() context) {
		const groupId = context.req.headers['group-id'];
		const requiredGroup = await this.groupService.editGroup(groupData, parseInt(groupId));

		if (!requiredGroup) {
			throw new InternalServerErrorException('Error while editing the Group');
		}

		return requiredGroup;
	}

	@UseGuards(AuthenticateUser)
	@UseGuards(AuthenticateGroupAdmin)
	@Mutation((returns) => GroupDetails, { name: 'AddUserToGroup'})
	public async addUser(@Args('userId') userId: number, @Context() ctx) {
		const groupId = ctx.req.headers['group-id'];
		const requiredGroup = await this.groupService.addUserToGroup(userId, parseInt(groupId));

		if (!requiredGroup) {
			throw new InternalServerErrorException('Error while adding new User to Group');
		}

		return requiredGroup;
	}

	@UseGuards(AuthenticateUser)
	@Mutation((returns) => GroupOverview, {name: 'LeaveGroup'})
	public async leaveGroup(@Args('groupId') groupId: number, @Context() ctx) {
		const userId = ctx.req.headers['user-id'];
		const requiredGroup = await this.groupService.leaveGroup(parseInt(userId), groupId);

		if (!requiredGroup) {
			throw new InternalServerErrorException('Error while leaving the group');
		}

		return requiredGroup;
	}

	@UseGuards(AuthenticateUser)
	@Query((returns) => GroupDetails, { name: 'GetGroupDetail' })
	public async getGroupDetail(@Args('groupId') groupId: number) {
		const requiredGroup = await this.groupService.getGroupDetails(groupId);

		if (!requiredGroup) {
			throw new InternalServerErrorException('Error while fetching group details');
		}

		return requiredGroup;
	}

	@UseGuards(AuthenticateUser)
	@UseGuards(AuthenticateGroupAdmin)
	@Mutation((returns) => GroupOverview, { name: 'DeleteGroup' })
	public async deleteGroup(@Args('groupId') groupId: number) {
		const requiredGroup = await this.groupService.deleteGroup(groupId);

		if (!requiredGroup) {
			throw new InternalServerErrorException('Error while deleting the group');
		}

		return requiredGroup;
	}
}
