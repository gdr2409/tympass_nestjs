import { Module } from "@nestjs/common";
import { neo4jProvider } from "./neo4j.provider";
import { Neo4jService } from './neo4j.service';

@Module({
	providers: [neo4jProvider, Neo4jService],
	exports: [Neo4jService]
})

export class Neo4jModule {}