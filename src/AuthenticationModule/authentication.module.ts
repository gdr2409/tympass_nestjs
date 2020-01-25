import { Module } from '@nestjs/common';
import { Neo4jModule } from '../Neo4j/neo4j.module';
import { AuthTokenService } from './authentication.token.service';

@Module({
	providers: [AuthTokenService],
	exports: [AuthTokenService],
	imports: [Neo4jModule],
})

export class AuthenticationModule {}
