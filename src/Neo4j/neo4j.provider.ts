import { v1 } from 'neo4j-driver';

export const neo4jProvider = {
	provide: 'Neo4jProvider',
	useFactory: () => v1.driver('bolt://localhost:7687', v1.auth.basic('neo4j', 'password')),
};
