import { Module } from "@nestjs/common";
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserData } from './user.entity';
import { UserResolver } from "./user.resolver";
import { Neo4jModule } from "../Neo4j/neo4j.module";
import { UserNeo4jService } from "./user.neo4j.service";
import { AuthenticationModule } from "../AuthenticationModule/authentication.module";

@Module({
	providers: [UserService, UserResolver, UserNeo4jService],
	imports: [TypeOrmModule.forFeature([UserData]), Neo4jModule, AuthenticationModule],
	exports: [UserService, TypeOrmModule, UserNeo4jService]
})

export class UserModule {}