import { Module } from '@nestjs/common';
import { Neo4jModule } from '../Neo4j/neo4j.module';
import { UserGroupService } from './user.group.service';
import { GroupDetailsResolver } from './user.group.resolver';
import { UserModule } from '../UsersModule/user.module';
import { CacheModule } from '../CacheModule/cache.module';

@Module({
	providers: [UserGroupService, GroupDetailsResolver],
	exports: [UserGroupService],
	imports: [Neo4jModule, UserModule, CacheModule],
})

export class UserGroupModule {}