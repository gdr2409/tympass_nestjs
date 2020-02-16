import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './UsersModule/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './ConfigModule/config.module';
import { ConfigService } from './ConfigModule/config.service';
import { UserData } from './UsersModule/user.entity';
import { UserService } from './UsersModule/user.service';
import { UserModule } from './UsersModule/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { Neo4jModule } from './Neo4j/neo4j.module';
import { UserGroupModule } from './UserGroupModule/user.group.module';
import { CacheModule } from './CacheModule/cache.module';
import { RedisService } from './CacheModule/cache.service';

@Module({
  imports: [TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: async (configService: ConfigService) => ({
			type: 'postgres' as 'postgres',
			host: await configService.getHost(),
			port: await configService.getPort(),
			database: await configService.getDatabase(),
			password: await configService.getPassword(),
			username: await configService.getUsername(),
			entities: [UserData],
			synchronize: false,
		}),
		inject: [ConfigService],
	}),
	GraphQLModule.forRoot({
		autoSchemaFile: 'schema.gql',
		context: ({ req, res }) => ({ req, res }),
	}),
	UserGroupModule,
	UserModule,
	Neo4jModule,
	CacheModule,
	ConfigModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, RedisService],
})
export class AppModule {}
