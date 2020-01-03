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

@Module({
  imports: [TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: async (configService: ConfigService) => ({
			type: 'postgres' as 'postgres',
			host: configService.getHost(),
			port: configService.getPort(),
			database: configService.getDatabase(),
			password: configService.getPassword(),
			username: configService.getUsername(),
			entities: [UserData],
			synchronize: true
		}),
		inject: [ConfigService]
	}),
	GraphQLModule.forRoot({
		autoSchemaFile: 'schema.gql',
		context: ({ req, res }) => ({ req, res })
	}),
	UserModule,
	Neo4jModule
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService]
})
export class AppModule {}
